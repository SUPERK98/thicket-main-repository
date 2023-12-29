import React, {useEffect, useState} from 'react';
import {
    Container,
    H1,
    Input,
    PaddingTopDiv,
    RightDiv,
    Table,
    Td,
    Th
} from "../../assets/css/setting/admin/StylesOfCreate";

export const MemberMyPage = ({contentHandler}) => {

    const handleWithdrawalClick = () => {
        contentHandler("withdraw");
    };

    // States to track passwords
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [memberName, setMemberName] = useState("");
    const [memberBirth, setMemberBirth] = useState("");
    const [memberPhone, setMemberPhone] = useState("");
    const [memberEmail, setMemberEmail] = useState("");

    // State to track password check result
    const [passwordCheckResult, setPasswordCheckResult] = useState(true);
    useEffect(() => {
        fetch('/thicket-member/members',{
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setMemberName(data.name);
                setMemberBirth(data.birth);
                setMemberPhone(data.phoneNumber);
                setMemberEmail(data.email);
            })
    }, []);

    useEffect(() => {
        if (newPassword !=="" && confirmNewPassword !== "" && newPassword !== confirmNewPassword) {
            setPasswordCheckResult(false)
            return;
        }
        setPasswordCheckResult(true)
    }, [newPassword,confirmNewPassword]);

    // 비밀번호 변경 함수
    const handlePasswordChange = () => {
        if (newPassword !== confirmNewPassword) {
            alert("기존 비밀번호와 신규 비밀번호가 일치하지 않습니다.")
            return;
        }
        if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmNewPassword.trim() === "") {
            alert("비밀번호 변경란을 모두 입력해 주십시오.")
            return;
        }
        fetch('/thicket-member/members',{
            method: "PATCH",
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type':'application/json'
            },
            body: JSON.stringify({currentPassword,newPassword})
        })
            .then(res => res.text())
            .then(data => alert(data));

        setCurrentPassword("");
        setConfirmNewPassword("");
        setNewPassword("");
    };

    return (
        <Container>
            <div>
                <H1>기본정보</H1>
                <Table>
                    <tbody>
                    <tr>
                        <Th>이름</Th>
                        <Td>{memberName}</Td>
                    </tr>
                    <tr>
                        <Th>생년월일</Th>
                        <Td>{memberBirth}</Td>
                    </tr>
                    <tr>
                        <Th>전화번호</Th>
                        <Td>{memberPhone}</Td>
                    </tr>
                    <tr>
                        <Th>이메일</Th>
                        <Td>{memberEmail}</Td>
                    </tr>
                    </tbody>
                </Table>
            </div>
            <br />
            <PaddingTopDiv>
                <H1>비밀번호 변경</H1>
                <Table>
                    <tbody>
                    <tr>
                        <Th>기존 비밀번호</Th>
                        <Td>
                            <Input
                                type="password"
                                id="currentPassword"
                                placeholder="  비밀번호를 입력하세요."
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Td>
                    </tr>
                    <tr>
                        <Th>신규 비밀번호</Th>
                        <Td>
                            <Input
                                type="password"
                                id="newPassword"
                                placeholder="  비밀번호를 입력하세요."
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Td>
                    </tr>
                    <tr>
                        <Th>신규 비밀번호 재확인</Th>
                        <Td>
                            <Input
                                type="password"
                                id="confirmNewPassword"
                                placeholder="  비밀번호를 입력하세요."
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <button style={{marginLeft: '10px',
                                            padding: '4px 12px', color: 'white', backgroundColor: 'gray',
                                            borderRadius: '4px', border: 'none'}}
                                    onClick={handlePasswordChange}>변경</button>
                            {passwordCheckResult === false && (
                                <p style={{ color: 'red', fontSize:'15px'}}>비밀번호가 일치하지 않습니다.</p>
                            )}
                        </Td>
                    </tr>
                    </tbody>
                </Table>
            </PaddingTopDiv>
            <RightDiv>
                <button style={{marginLeft: '10px', marginRight: '5px',
                                padding: '6px 13px', color: 'white', backgroundColor: 'lightgray',
                                borderRadius: '4px', border: 'none'}}
                        onClick={handleWithdrawalClick}>회원탈퇴</button>
            </RightDiv>
        </Container>
    );
};