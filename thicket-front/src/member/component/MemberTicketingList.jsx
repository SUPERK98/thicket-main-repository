import React, {useEffect, useState} from "react";
import {Container, H1, Table, Td, Th} from '../../assets/css/setting/admin/StylesOfList';
import ReactDOM from "react-dom";
import Cancel1 from "../../payment/pages/Cancel1";

export const MemberTicketingList = () => {

    const [tickets, setTickets] = useState([]);   // 예매 내역

    useEffect(() => {
        fetch('/thicket-ticket/reservations/future',{
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data.content);
            })
    }, []);

    const handleCancelClick = (ticketId) => {
        const width = Math.floor(window.innerWidth * 0.7);
        const height = Math.floor(window.innerHeight * 0.8);
        const left = Math.floor((window.innerWidth - width) / 2);
        const top = Math.floor((window.innerHeight - height) / 2);

        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

        const cancelWindow = window.open('', '_blank', windowFeatures);

        const closeWindowCallback = () => {
            cancelWindow.close();
            window.location.reload(); // 창 닫히고 새로고침
        };

        ReactDOM.render(
            <Cancel1 ticketId={ticketId} onCancel={closeWindowCallback} />,
            cancelWindow.document.body
        );
    };

    const isCancelable = (dateString) => {
        const currentDate = new Date();
        const reservationDate = new Date(dateString);
        const timeDifference = reservationDate - currentDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference > 3;
    };

    return (
        <Container>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <H1>예매 내역</H1>
                    </div>
                    <div>
                        <a>취소 가능 일자 : 오픈 3일전 까지</a>
                    </div>
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
                        <Th width="100px">예매취소</Th>
                        <Th width="100px">상태</Th>
                    </tr>
                    {tickets && tickets.length > 0 ? (
                        tickets.map((item) => (
                            <tr key={item.id}>
                                <Td>{new Date(item.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</Td>
                                <Td>{item.id.slice(0, 4)}**{item.id.slice(-2)}</Td>
                                <Td>{item.stageType}</Td>
                                <Td>{item.stageName}</Td>
                                <Td>{item.place}</Td>
                                <Td>{new Date(item.date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</Td>
                                <Td>
                                    {isCancelable(item.date) ? (
                                        <button style={{padding: '4px 12px', color: 'white', backgroundColor: 'gray',
                                                        borderRadius: '4px', border: 'none'}}
                                                onClick={() => handleCancelClick(item.id)}>취소</button>
                                    ) : (
                                        <span>취소불가</span>
                                    )}
                                </Td>
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