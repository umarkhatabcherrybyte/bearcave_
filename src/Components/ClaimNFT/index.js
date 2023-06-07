import React, { useState } from 'react';
import { Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center',
    color: '#000',
  },
  button: {
    marginTop: 10,
  },
}));

function ModalComponent() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Modal
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <p>This is the modal content.</p>
          <Button variant="contained" color="secondary" className={classes.button} onClick={handleClose}>
            Close Modal
          </Button>
          <Button variant="contained" color="primary" className={classes.button}>
            Claim
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalComponent;
