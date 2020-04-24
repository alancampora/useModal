import React, { useReducer } from 'react';
import './styles.css';

function Dialog(props) {
  return (
    <div
      style={{
        border: '3px solid black',
        borderRadius: '5px',
        margin: '1rem'
      }}>
      <div
        className="header"
        style={{
          fontSize: '1.5em',
          padding: '0.5rem',
          background: 'black',
          color: 'white'
        }}>
        <div> {props.title}</div>
      </div>
      <div
        className="content"
        style={{
          padding: '1rem'
        }}>
        {props.content}
      </div>
      <div className="footer">
        {props.buttons &&
          props.buttons.map((button, index) => (
            <button
              style={{ margin: '0.5rem' }}
              key={index}
              onClick={button.action}>
              {button.label}
            </button>
          ))}
      </div>
    </div>
  );
}

const FLOW = {
  CONFIRM: 'confirm',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  OFF: 'off'
};

function useModal(modalConfiguration) {
  function reducer(_, action) {
    switch (action.type) {
      case FLOW.CONFIRM:
        return { show: FLOW.CONFIRM };
      case FLOW.LOADING:
        return { show: FLOW.LOADING };
      case FLOW.SUCCESS:
        return { show: FLOW.SUCCESS };
      case FLOW.ERROR:
        return { show: FLOW.ERROR };
      default:
        return { show: FLOW.OFF };
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    show: FLOW.OFF
  });

  function Modal() {
    return (
      <div>
        {Object.keys(modalConfiguration).map(
          (key, index) =>
            state &&
            state.show === key && (
              <Dialog
                key={index}
                {...modalConfiguration[key]}
              />
            )
        )}
      </div>
    );
  }

  return [
    Modal,
    () => dispatch({ type: FLOW.CONFIRM }),
    dispatch
  ];
}

export default function App(thunk) {
  const [Modal, openModal, dispatch] = useModal({
    [FLOW.OFF]: {
      title: 'Main modal is OFF',
      content: <div>Modal Content</div>
    },
    [FLOW.CONFIRM]: {
      title: 'Do you want to remove the item?',
      content: <div>This action will be permanent </div>,
      buttons: [
        {
          label: 'Yes',
          action: () => {
            dispatch({ type: FLOW.LOADING });
            setTimeout(function() {
              dispatch({ type: FLOW.SUCCESS });
            }, 1000);
          }
        }
      ]
    },
    [FLOW.LOADING]: {
      title: 'Loading',
      content: <div>LOADING...</div>
    },
    [FLOW.SUCCESS]: {
      title: 'Success',
      content: (
        <div style={{ color: 'green' }}>
          The item was removed successfully
        </div>
      )
    }
  });

  const [
    OtherModal,
    otherOpenModal,
    otherModalDispatch
  ] = useModal({
    [FLOW.OFF]: {
      title: 'Other Modal is OFF',
      content: <div>Modal Content</div>,
      buttons: []
    },
    [FLOW.CONFIRM]: {
      title: 'Do you want to add a new Item',
      content: <div>Confirm</div>,
      buttons: [
        {
          label: 'obvio',
          action: () =>
            otherModalDispatch({ type: FLOW.SUCCESS })
        }
      ]
    },
    [FLOW.SUCCESS]: {
      title: 'Success',
      content: <div>Item added</div>,
      buttons: []
    }
  });
  return (
    <div className="App">
      <button onClick={openModal}>open modal</button>
      <Modal />

      <button onClick={otherOpenModal}>
        open other modal
      </button>

      <OtherModal />
    </div>
  );
}
