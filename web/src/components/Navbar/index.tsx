import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { RiFilePaper2Line } from "react-icons/ri";
import { BsGearFill } from "react-icons/bs";
import { UserAuth } from "../../context/AuthContext";
import Button from "../Button";
import { FC, useState } from "react";
import { Modal } from "../index";

import {
  Container,
  IconContainer,
  LinkT,
  ProfileImgSty,
  NavGame,
} from "./styles";

export enum NAVBAR_TYPE_CLASSES {
  base = "base",
  game = "game",
}

const getNavbar = (navbarType = NAVBAR_TYPE_CLASSES.base): typeof Container =>
  ({
    [NAVBAR_TYPE_CLASSES.base]: Container,
    [NAVBAR_TYPE_CLASSES.game]: NavGame,
  }[navbarType]);

type NavbarProps = {
  navbarType?: NAVBAR_TYPE_CLASSES;
};

const Navbar: FC<NavbarProps> = ({ navbarType }) => {
  const { user } = UserAuth();
  const [openModal, setOpenModal] = useState(false);
  const [gameRules, setGameRules] = useState(false);

  const CustomNavbar = getNavbar(navbarType);

  const handleOpenModalRules = () => {
    setGameRules(true);
    setOpenModal((prev) => !prev);
  };

  const handleOpenModalProfile = () => {
    setGameRules(false);
    setOpenModal((prev) => !prev);
  };

  return (
    <CustomNavbar>
      <ul>
        <li>
          <IconContainer>
            <Link to="/">
              <AiOutlineHome size={40} color={"white"} />
            </Link>
          </IconContainer>
        </li>
        <li>
          <IconContainer>
            <RiFilePaper2Line
              onClick={handleOpenModalRules}
              size={40}
              color={"white"}
            />
          </IconContainer>

          {/* <img src={GameRules} alt="game rules" /> */}
        </li>
      </ul>
      {openModal && (
        <Modal
          gameRules={gameRules}
          closeModal={() => setOpenModal(false)}
        />
      )}
      {(user && (
        <ul>
          <li>
            <IconContainer>
              <BsGearFill size={40} color={"white"} />
            </IconContainer>
          </li>

          <li>
            <IconContainer>
              <ProfileImgSty
                onClick={handleOpenModalProfile}
                src={user.profilePicture}
                alt="user profile"
              />
            </IconContainer>
          </li>
        </ul>
      )) || (
        <ul id="rightNav">
          <li>
            <IconContainer>
              <BsGearFill size={40} color={"white"} />
            </IconContainer>
          </li>
          <li>
            <LinkT to="/signin">
              <Button>LOGIN</Button>
            </LinkT>
          </li>
        </ul>
      )}
    </CustomNavbar>
  );
};

export default Navbar;
