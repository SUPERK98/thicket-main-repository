import styled from "styled-components";
import {FaSearch} from "react-icons/fa";
import HeaderMenu from "./HeaderMenu";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {HttpStatusCode} from "axios";


const LogoHeader = styled.header`
  width: 100%;
  //height: 18px;
  top: -10px;
  left: 0;
  display: flex;
  justify-content: left;
  position: fixed; /* 로고 헤더를 화면 상단에 고정합니다. */
  background-color: #efefef; /* 로고 헤더의 배경색을 지정합니다. */
  z-index: 1000; /* 로고 헤더가 다른 요소 위에 나타나도록 설정합니다. */
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
`

const Menubar = styled.div`
  width: 120%; // 100%로 하면 이상하게 가장자리가 조금 부족함;
  background-color: #efefef;
  display: flex;
  position: fixed;
  top: 82px; /* 로고 위치에 따라 수동 조절. 로고 헤더의 높이만큼 여백을 두어 로고 아래로 내려가게 합니다. */
  z-index: 1000; /* 로고 아래에 나타나도록 로고 헤더보다 낮은 인덱스를 지정합니다. */
`
const SearchInput = styled.input`
  height: 30px;
  width: 200px;
  margin-right: 10px;
  border: lightgray solid 1px; // 실선 테두리
`;

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem('token');
        // 토큰 변경 시 로그인 상태 업데이트
        if(token === null) {
            setIsLoggedIn(false)
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
    const [query, setQuery] = useState("");

    const logoutHandler = () => {
        // 로그아웃 로직을 구현합니다. 예를 들어, localStorage에서 토큰을 제거합니다.
        fetch("/thicket-member/members/logout",{
            method: 'GET',
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        }).then(response => {
            if (response.status === HttpStatusCode.Ok) {
                localStorage.removeItem('token');
            }
        })
        localStorage.removeItem('token');
    };

    const handleSearch = () => {
        if (query) {
            navigate(`/search/${query}`); // useHistory 대신 useNavigate 사용
        }
    };

    return (
        <div>
            <LogoHeader>
                <div style={{ width: "320px", textAlign: "center", display: "flex", zIndex: "1000" }}>
                    <a href={"/"}>
                        <img src={"https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%ED%97%A4%EB%8D%94+%EC%9D%B4%EB%AF%B8%EC%A7%80.png"} alt="로고 이미지"/>
                    </a>
                </div>
            </LogoHeader>
            <Wrapper >
                <Menubar>
                    <div style={{ display: "flex", margin: "auto", marginLeft: "450px", marginRight: "190px" }}>
                            <div style={{ width: "25px" }}></div>
                            <HeaderMenu name={"뮤지컬"} link={"/musical"} />
                            <HeaderMenu name={"연극"} link={"/play"} />
                            <HeaderMenu name={"콘서트"} link={"/concert"} />
                            <HeaderMenu name={"티켓오픈"} link={"/soon"} />
                        </div>
                    <div style={{ display: "flex", alignItems: "center", width: "750px"}}>
                        <div style={{ width: "20px" }}></div>
                        <SearchInput
                            type="text"
                            placeholder=" 검색어를 입력해 주세요"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                marginRight: "35px"
                            }}
                            onClick={handleSearch}
                        >
                            <FaSearch />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {isLoggedIn ? (
                                <>
                                    <HeaderMenu name={'마이페이지'} link={'/mypage'} />
                                    <HeaderMenu name={'로그아웃'} link={'/login'} onClick={logoutHandler}/>
                                </>
                            ) : (
                                <>
                                    <HeaderMenu name={'로그인'} link={'/login'} />
                                    <HeaderMenu name={'회원가입'} link={'/auth'} />
                                </>
                            )}
                        </div>
                    </div>
                </Menubar>
            </Wrapper>
        </div>
    )
}