import React, {useEffect, useState} from 'react';
import Payment from "./Payment";
import moment from "moment";
import MyPage from "../../member/pages/MyPage";

function Reservation({ selectedChair, selectedTime, selectedDate, selectedQuantity, onCancel }) {

    const [isPaymentVisible, setPaymentVisible] = useState(false);
    const [isGoToMypage, setGoToMypage] = useState(false);
    const [show, setShow] = useState([]);       // 공연정보
    const [times, setTimes] = useState([]);     // 공연정보-시간리스트
    const [chairs, setChairs] = useState([]);   // 단일시간-좌석리스트
    const [totalAmount, setTotalAmount] = useState(0);  // 선택된 좌석의 총 금액을 저장할 새로운 상태
    const [serverTime, setServerTime] = useState(Date);

    // 공연 상세 가져오기
    useEffect(() => { // 공연정보 (SELECT * FROM thicket_stage.stage; → id)
        // 현재 페이지의 url에서 공연 UUID 가져오기
        const showId = window.location.href.split("/")[4];
        // 공연 상세 API 호출
        fetch(`/thicket-show/shows/stagedetail/${showId}`)
            .then(response => response.json())
            .then(data => {
                setShow(data);
            })
            .then(fetch(`/thicket-show/tickets/all/${showId}`)
                .then(response => response.json())
                .then(data => {
                    setTimes(data);
                }));
        setInterval(dirtyCheck, 500);
    }, []);

    // 좌석정보 가져오기 회차정보 클릭시
    const getChairInfo = (stageId) => {
        fetch(`/thicket-show/chairs/all/${stageId}`)
            .then(response => response.json())
            .then(data => {
                setChairs(data);
            })
    }

    const dirtyCheck = async () => {
        await fetch('/thicket-show/shows/serverTime')
            .then(response => response.text())
            .then(data => {
                setServerTime(new Date(data));
            })
    };

    const handleGoToMypageClick = () => {
        if (onCancel) {
            onCancel(); // Invoke the onCancel callback function
        }
        setGoToMypage(true);
    };

    if (isGoToMypage) {
        return <MyPage />;
    }

    if (isPaymentVisible) {
        return <Payment
            selectedChair={selectedChair}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            selectedQuantity={selectedQuantity}
            totalAmount={totalAmount}
        />;
    }
    if (!selectedChair) {
        return <div>좌석을 선택하세요.</div>;
    }
    if (!selectedTime) {
        return <div>회차를 선택하세요.</div>;
    }
    if (!selectedDate) {
        return <div>날짜를 선택하세요.</div>;
    }

    return (
        <>
            {/*Header*/}
            <div
                style={{
                    backgroundColor: 'lightgray',
                    color: 'black',
                    padding: '5px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    borderRadius: '12px',
                }}
            >
                <div style={{ width: '19%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{ borderRight: '1px solid black',
                                    height: '80%', top: '10%',
                                    position: 'absolute', left: '20%' }}></div>
                        <h1>예매 대기</h1>
                    </div>
                </div>

                <div style={{ width: '44%', textAlign: 'left' }}>
                    <p>{show.name}</p>
                </div>

                <div style={{ width: '32%', textAlign: 'left'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{ borderRight: '1px solid black', height: '80%',
                                    top: '10%', position: 'absolute', left: '66.7%'}}></div>
                        <p>{show.place}</p>
                    </div>
                </div>
            </div>

            {/*Content*/}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    backgroundColor: 'white',
                }}
            >
                <div style={{ padding: '5px', maxHeight: '80vh', width: '31%', textAlign: 'left'}}>
                    <h1 style={{fontSize: '20px'}}>My 예매 정보</h1>
                    <hr />
                    <table>
                        <tbody>
                        <tr style={{height: '150px'}}>
                            <th style={{ textAlign: 'center', backgroundColor: 'lightgray', borderRadius: '5px'}}>
                                예매 일시<br /><br /><br />
                                선택좌석 <br /><br />
                                티켓 금액</th>
                            <td style={{ textAlign: 'right', width: '66%'}}>
                                {moment(selectedDate).format('YYYY년 MM월 DD일')}<br /> {selectedTime.time} <br /><br />
                                {selectedChair.chairType}석 {selectedQuantity}매 <br /><br />
                                {Number(selectedChair.price * selectedQuantity).toLocaleString()}원
                            </td>
                        </tr>
                        <hr style={{width: '315%'}} />
                        <tr style={{height: '66px'}}>
                            <th style={{ textAlign: 'left', backgroundColor: 'lightgray', borderRadius: '5px', padding: '5px' }}>
                                <div style={{ marginBottom: '5px' }}>
                                    취소 기한
                                </div>
                                <div>
                                    취소 수수료
                                </div>
                            </th>
                            <td style={{ textAlign: 'right', color: 'red', fontSize: '14px'}}>
                                <div style={{ marginBottom: '5px' }}>
                                    {moment(selectedDate-3).format('YYYY년 MM월 DD일')} 24:00 까지
                                </div>
                                <div>
                                    티켓 금액의 0~30%
                                </div>
                            </td>
                        </tr>
                        <hr style={{width: '315%'}} />
                        <tr style={{ height: '40px'}}>
                            <th style={{ color:'#7a7a7a', textAlign: 'left', borderRadius: '5px'}}>총 결제 금액 |</th>
                            <td style={{ textAlign: 'right', borderRadius: '5px'}}>
                                {Number(selectedChair.price * selectedQuantity).toLocaleString()}원</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <div
                    style={{
                        borderRight: '1px solid gray',
                        height: '90%',
                        width: '1%',
                    }}
                >
                </div>
                <div style={{ padding: '5px', width: '33%', textAlign: 'center', justifyContent: 'center'}}>
                    <h1 style={{fontSize: '20px'}}>예매 줄서기를 완료했습니다!! </h1>
                    <p> THICKETER의 요청을 모두 받고있어요. <br /><br /> 예매 완료 여부는 <br />마이페이지에서 알려드리겠습니다!
                    <br /><br /> 마이페이지에서 기다려주세요! </p>
                </div>
                <div
                    style={{
                        borderRight: '1px solid gray',
                        height: '90%',
                        width: '1%',
                    }}
                ></div>
                <div style={{ padding: '10px', maxHeight: '80vh', width: '30%', textAlign: 'left'}}>
                    <p style={{padding: '6px', backgroundColor: 'lightgray', borderBottom: '1px solid darkgray', borderRadius: '10px', marginBottom: '1px'}}>　</p>
                    <table>
                        <tbody>
                        <tr style={{height: '150px'}}>
                            <th style={{ textAlign: 'center', backgroundColor: 'lightgray', width: '25%', borderRadius: '5px'}}>
                                공연 <br /><br /><br />
                                장소 <br /><br />
                                좌석
                            </th>
                            <td style={{ textAlign: 'center', width: '80%', padding: '15px'}}>
                                {show.name}<br /><br />
                                {show.place} <br /><br />
                                {selectedChair.chairType}석 {selectedQuantity}매
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br />
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button
                            onClick={handleGoToMypageClick}
                            style={{
                                padding: '10px 12px',
                                backgroundColor: '#b0b0b0',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                width: '250px',
                                height: '45px',
                                fontSize: '15px',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#9a9999';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#b0b0b0';
                            }}
                        >마이페이지로 이동하기</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reservation;