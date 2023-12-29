import React, {useEffect, useState} from "react";
import {Container, H1, Table, Td, Th} from '../../assets/css/setting/admin/StylesOfList';

export const MemberViewingList = () => {

    const [viewing, setViewing] = useState([]);   // 관람 내역

    useEffect(() => {
        fetch('/thicket-ticket/reservations/past', {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setViewing(data.content);
            })
    }, []);

    return (
        <Container>
            <div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <H1>관람 내역</H1>
                </div>
                <Table>
                    <tbody>
                    <tr>
                        <Th width="130px">예매일</Th>
                        <Th width="115px">티켓고유번호</Th>
                        <Th width="70px">구분</Th>
                        <Th width="220px">공연명</Th>
                        <Th width="auto">장소</Th>
                        <Th width="130px">공연일</Th>
                        <Th width="100px">상태</Th>
                    </tr>
                    {viewing && viewing.length > 0 ? (
                        viewing.map((item) => (
                            <tr key={item.id}>
                                <Td>{new Date(item.createdAt).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })}</Td>
                                <Td>{item.id.slice(0, 4)}**{item.id.slice(-2)}</Td>
                                <Td>{item.stageType}</Td>
                                <Td>{item.stageName}</Td>
                                <Td>{item.place}</Td>
                                <Td>{new Date(item.date).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}</Td>
                                <Td>{item.status}</Td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <Td colSpan={8}>내역이 없습니다.</Td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};