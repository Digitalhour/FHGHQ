import React from 'react';

const ReactDOM = require('react-dom');

$(() => {
  let id = $(location).attr('href');
  id = id.replace(`${window.location.origin}/request/`, '');
  // window.id = id
  const globalid = id;

  // console.log(id);
  $.post(`/request2?${$.param({ id })}`, (response) => {
    // console.log(response)
    ReactDOM.render(
      <Modal info={response} />,
      document.getElementById('container')
    );
  });

  class Modal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        password: '',
      };
      this.handleChangeField = this.handleChangeField.bind(this);
      this.RequestAccess = this.RequestAccess.bind(this);
    }

    handleChangeField(event) {
      const { name } = event.target;
      const { value } = event.target;
      this.setState({ [name]: value });
    }

    SubmitData() {
      $.post(
        `/requestPassword?${$.param({
          globalid,
          password: this.state.password,
        })}`,
        (response) => {
          if (response === 'wrong') {
            alert('Wrong password!');
          }
          if (response === 'right') {
            location.replace(`${window.location.origin}/room/${globalid}`);
          }
        }
      );
    }

    RequestAccess() {
      $.post(`/request3?${$.param({ globalid })}`, (response) => {
        window.location.replace('/');
      });
    }

    render() {
      let steamid = document.cookie.substring(
        document.cookie.indexOf(' steamid=') + 9,
        document.cookie.indexOf(' steamid=') + 26
      );
      if (steamid.includes('anonymous')) {
        steamid = 'anonymous';
      }
      let body;
      let header = null;
      if (this.props.info.rank == 8) {
        body = (
          <>
            <h5>This room doesn't exist</h5>
            <button
              type='button'
              className='btn'
              onClick={() => window.location.replace('/')}
            >
              Return to profile
            </button>
          </>
        );
      } else {
        header = (
          <h5>
            This is room
            {this.props.info.roomname} created by
            <a
              href={`https://steamcommunity.com/profiles/${this.props.info.adminid}`}
            >
              {this.props.info.admin}
            </a>
          </h5>
        );
        if (this.props.info.secure == 0) {
          body = (
            <div>
              <h5>
                Password:
                <input
                  type='text'
                  name='password'
                  onChange={(e) => this.handleChangeField(e)}
                />
              </h5>
              <button
                type='button'
                className='btn'
                onClick={() => this.SubmitData()}
              >
                Submit
              </button>
              <button
                type='button'
                className='btn'
                onClick={() => window.location.replace('/')}
              >
                Return to profile
              </button>
            </div>
          );
        } else if (steamid == 'anonymous') {
          body = (
            <>
              <h5>
                This room is secure. Only Steam-logged users can access this
                room.
              </h5>
              <button
                type='button'
                className='btn'
                onClick={() => window.location.replace('/')}
              >
                Return to profile
              </button>
            </>
          );
        } else {
          switch (this.props.info.rank) {
            case 4:
              body = (
                <>
                  <h5>You have been banned from this room</h5>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => window.location.replace('/')}
                  >
                    Return to profile
                  </button>
                </>
              );
              break;
            case 5:
              body = (
                <>
                  <h5>You have already requested access to this room</h5>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => window.location.replace('/')}
                  >
                    Return to profile
                  </button>
                </>
              );
              break;
            case 7:
              body = (
                <button
                  type='button'
                  className='btn'
                  onClick={this.RequestAccess}
                >
                  Request room access
                </button>
              );
              break;
          }
        }
      }
      return (
        <div className='modal show' id='modal' style={{ display: 'block' }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h4 className='modal-title'>Request room access</h4>
              </div>
              <div className='modal-body'>
                {header}
                {body}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
});
