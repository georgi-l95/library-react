import React, { Fragment } from "react";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.title}>{props.title}</div>
      <div className={classes.content}>
        <div className={classes["loader-div"]}>
          {props.loading && <div className={classes.loader}></div>}
        </div>
        <div className={classes["content-container"]}>{props.children}</div>
      </div>
    </div>
  );
};
const Modal = (props) => {
  return (
    <Fragment>
      <Backdrop />
      <ModalOverlay title={props.title} loading={props.loading}>
        {props.children}
      </ModalOverlay>
    </Fragment>
  );
};

export default Modal;
