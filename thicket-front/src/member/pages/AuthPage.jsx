import React, {useContext, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {EmailContext} from "../component/Layout";
import {H1} from "../../assets/css/setting/admin/StylesOfCreate";
import {H2} from "../../assets/css/setting/MainStyleCSS";

const inlineStyles = {
  authPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  formRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  button: {
    marginLeft: '10px', marginRight: '5px',
    padding: '6px 13px',
    borderRadius: '4px', border: 'none'
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

function AuthPage() {
  const { email, setEmail } = useContext(EmailContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`/thicket-member/email?email=${email}`, { email });
      console.log(response.data);
      openModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const sendAuthCode = async () => {
    try {
      const response = await axios.post('/thicket-member/email', { email, code: authCode });
      console.log(response.data);

      if (response.status === 200) {
        closeModal();
        navigate('/signup');
      } else {
        // Handle other status codes or show an error message
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div style={inlineStyles.authPageContainer}>
        <div style={{ border: '1px solid #000', borderRadius: '5px', padding: '10px', display: 'inline-block', textAlign: 'center' }}>
          <H1 style={{textAlign:'left'}}>회원가입</H1> <hr />
          <H2>환영합니다! <br /><br />
            본인 인증을 위해  <br /> 이메일 주소를 입력해 주세요!</H2> <br />

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', marginBottom: '20px',
            }}>
              <label style={{marginRight: '10px'}}>이메일 주소  : </label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" style={{ marginLeft: '10px', marginRight: '5px',
                                              padding: '6px 13px', color: 'white', backgroundColor: '#E72C25',
                                              borderRadius: '4px', border: 'none'}}>제출</button>
            </div>
          </form>

          {modalOpen && (
              <div style={inlineStyles.modal}>
                <div style={inlineStyles.modalContent}>
                  <br /> <h3>인증 번호를 입력해 주세요</h3> <br />
                  <input type="text" value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
                  <button onClick={sendAuthCode} style={{marginLeft: '10px', marginRight: '4px', marginTop: '4px',
                                                    padding: '5px 13px', color: 'white', backgroundColor: '#E72C25',
                                                    borderRadius: '4px', border: 'none'}}> 제출</button>
                  <button onClick={closeModal} style={{marginLeft: '10px', marginRight: '5px',marginTop: '4px',
                                                    padding: '5px 13px', color: 'white', backgroundColor: 'gray',
                                                    borderRadius: '4px', border: 'none'}}> 닫기</button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default AuthPage;