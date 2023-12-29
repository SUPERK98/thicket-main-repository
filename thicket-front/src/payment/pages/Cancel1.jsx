import React, {useEffect, useState} from 'react';
import Cancel2 from "./Cancel2";

function Cancel1(props ) {

    const [ticket, setTicket] = useState([]);   // 예매 내역

    useEffect(() => {
        fetch(`/thicket-ticket/reservations/${props.ticketId}`, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setTicket(data);
            })
    }, [props.ticketId]);

    const [showCancel2, setShowCancel2] = useState(false);

    const handleCancel2Click = () => {
        // showCancel2를 true로 설정하여 Cancel2 컴포넌트를 렌더링합니다.
        setShowCancel2(true);
    };

    // 현재 티켓의 일시 값
    const ticketDate = new Date(ticket.date);

    // 취소 기한 계산: 티켓 일시에서 3일을 뺀 값
    const cancelDate = new Date(ticketDate);
    cancelDate.setDate(ticketDate.getDate() - 3);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {showCancel2 ? (
                <Cancel2 ticketId={props.ticketId} ticket={setTicket} closeWindowCallback={props.onCancel} />
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        backgroundColor: 'lightgray',
                        color: 'black',
                        padding: '5px',
                        textAlign: 'center',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',  // 추가된 부분
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        borderRadius: '12px',
                        width:'100%',
                    }}
                    >
                        <div >
                            <h1>취소 신청</h1>
                        </div>
                        <div>
                            <h1 style={{ color: 'white' }}>확인 절차</h1>
                        </div>
                        <div>
                            <h1 style={{ color: 'white'}}>취소 완료</h1>
                        </div>
                    </div>
                    <div style={{ width: '80%', backgroundColor: 'lightgray', marginTop: '10px', padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            <div>본 예매 내역을 취소하시겠습니까?</div>
                            <div>취소/환불 내역을 확인한 후 [예매취소하기] 버튼을 클릭해 주시기 바랍니다.</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div>
                                <button style={{padding: '4px 12px', color: 'white', backgroundColor: 'gray',
                                                borderRadius: '4px', border: 'none'}} onClick={handleCancel2Click}>예매취소하기</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ padding: '5px 50px', width: '80%', textAlign: 'left'}}>
                            <div><h1 style={{ fontSize: '20px' }}>예약번호 : {`${ticket?.id?.slice(0, 4)}**${ticket?.id?.slice(-2)}`}</h1></div>
                            <hr />
                            <div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td style={{ width: '100px'}}>고객명</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{ticket.memberName}</th>
                                    </tr>
                                    <tr>
                                        <td>공연제목</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{ticket.stageName}</th>
                                    </tr>
                                    <tr>
                                        <td>장소</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{ticket.place}</th>
                                    </tr>
                                    <tr>
                                        <td>일시</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>
                                            {new Date(ticket.date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>좌석</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{ticket.chairType}석 {ticket.count}개</th>
                                    </tr>
                                    <tr>
                                        <td>티켓금액</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{parseInt(ticket.price * ticket.count).toLocaleString()}원</th>
                                    </tr>
                                    <tr>
                                        <td>취소기한</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>
                                            {cancelDate.toLocaleString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ padding: '5px 50px', width: '80%', textAlign: 'left'}}>
                            <div><h1 style={{fontSize: '20px'}}>결제정보</h1></div>
                            <hr />
                            <div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td style={{ width: '100px'}}>환불방법</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{ticket.method}</th>
                                    </tr>
                                    <tr>
                                        <td>환불금액</td>
                                        <th style={{ width: '250px', textAlign: 'left' }}>{parseInt(ticket.price * ticket.count).toLocaleString()}원</th>
                                    </tr>
                                    {/*<tr>*/}
                                    {/*    <td>환불계좌</td>*/}
                                    {/*    <th style={{ width: '250px', textAlign: 'left' }}> - </th>*/}
                                    {/*</tr>*/}
                                    {/*<tr>*/}
                                    {/*    <td>예금주명</td>*/}
                                    {/*    <th style={{ width: '250px', textAlign: 'left' }}>{ticket.memberName}</th>*/}
                                    {/*</tr>*/}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cancel1;