import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {H1} from "../../assets/css/setting/admin/StylesOfCreate";
import {HttpStatusCode} from "axios";


const inlineStyles = {
  loginFormContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100vh',
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    marginRight: '10px'
  },
  label: {
    width: '120px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  }
};

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cache-Control", "no-cache");

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    };

    fetch("/thicket-member/members/USER", requestOptions)
        .then(response => {
          if (response.status === 400) {
              return response.text();
          }
          if (response.status === HttpStatusCode.PermanentRedirect) {
            localStorage.setItem('token', response.headers.get('Authorization'));
          }
          if(response.status === HttpStatusCode.Accepted) {
            alert("중복된 로그인 입니다. 기존 로그인을 해제 후 시도해주세요.")
          }
          return response.text();
        })
        .then(result => {
          // 로그인이 성공한 경우에만 리디렉션
          if (localStorage.getItem('token') !== null) {
              window.location.replace("/");
          } else {
              alert(result);
          }
        })
  };

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
      <div style={inlineStyles.loginFormContainer}>
        <div style={{ border: '1px solid #000', borderRadius: '5px', padding: '10px', display: 'inline-block' }}>
          <form onSubmit={handleSubmit}>
            <H1>로그인</H1>
            <div style={inlineStyles.formRow}>
              <label style={inlineStyles.label}>이메일 주소:</label>
              <input type="email" value={email} onChange={handleEmailChange} style={inlineStyles.input} />
            </div>
            <div style={inlineStyles.formRow}>
              <label style={inlineStyles.label}>비밀번호:</label>
              <input type="password" value={password} onChange={handlePasswordChange} style={inlineStyles.input} />
            </div>
            <div style={inlineStyles.buttonContainer}>
              <button type="submit" style={{
                                              padding: '8px 16px',
                                              backgroundColor: '#E72C25',
                                              color: '#fff',
                                              border: 'none',
                                              borderRadius: '4px',
                                              cursor: 'pointer',
                                              width: '320px', marginTop: '5px'
                                            }}>로그인</button>
              </div>
          </form>
        </div>
        <button className="signup-button" onClick={handleSignUp} style={{
          padding: '8px 16px', color: 'gray', backgroundColor: '#fff',
          borderRadius: '4px', border: 'none', font: 'bold'//, marginLeft: '280px'
        }}>| 회원가입 |</button>
      </div>
  );
}

export default Login;