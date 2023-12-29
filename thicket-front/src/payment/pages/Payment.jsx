import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ReadyKakaopay from "../../member/pages/ReadyKakaopay";
import useDetectClose from "../component/UseDetectClose";
import {Dropdown} from "../component/Dropdown";
import "../../assets/css/style.css"

function Payment({ selectedChair, selectedTime, selectedDate, selectedQuantity }) {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [show, setShow] = useState([]);       // 공연정보
    // const [times, setTimes] = useState([]);     // 공연정보-시간리스트
    // const [chairs, setChairs] = useState([]);   // 단일시간-좌석리스트
    const dropDownRef = useRef();
    const [identify, setIdentify] = useState('선택해주세요');
    const [generatedNumber, setGeneratedNumber] = useState(null);
    const list = ['농협은행', '국민은행', '하나은행'];
    const [isOpen, setIsOpen] = useDetectClose(dropDownRef, false);
    const [serverTime, setServerTime] = useState(Date);
    const [isGoToReadyKakaopay, setGoToReadyKakaopay] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const generateNumber = (bank) => {
        switch (bank) {
            case '농협은행':
                return '12345';
            case '국민은행':
                return '45678';
            case '하나은행':
                return '11111';
            default:
                return '';
        }
    };

    const handleBankSelection = (selectedBank) => {
        const generatedNum = generateNumber(selectedBank);
        setGeneratedNumber(generatedNum);
        setIdentify(selectedBank);
        setIsOpen(false);
        // 직접 선택한 은행을 사용하여 조건 확인
        if (selectedBank === '선택해주세요') {
            setAlertMessage('입금 은행을 선택해주세요!');
        } else {
            setAlertMessage('');
        }
    };

    useEffect(() => {
        // 페이지가 처음 렌더링될 때 초기 상태
        setPaymentMethod('bank');
    }, []);

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
    }, []);

    // 좌석정보 가져오기 회차정보 클릭시
    const getChairInfo = (stageId) => {
        fetch(`/thicket-show/chairs/all/${stageId}`)
            .then(response => response.json())
            .then(data => {
            })
    }

    const handlePayment = () => {
        if (paymentMethod === 'kakao') {
            // console.log(`카카오페이 결제: ${Number(selectedChair.price * selectedQuantity)}원`);
            setGoToReadyKakaopay(true);
        } else if (paymentMethod === 'bank') {
            if (identify === '선택해주세요') {
                setAlertMessage('입금 은행을 선택해주세요!');
            } else {
                console.log(`무통장 입금 (${identify}): ${Number(selectedChair.price * selectedQuantity)}원`);
                // 여기에 무통장 입금 관련 처리 추가
                // fetch('/thicket-ticket/feign/payments', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         amount: Number(selectedChair.price * selectedQuantity),
                //         bank: identify,
                //     }),
                // })
                // .then(response => response.json())
                // .then(data => {
                //     // 여기에 팝업창 등의 처리 추가
                // });
            }
        }
    };

    if(isGoToReadyKakaopay){
        return <ReadyKakaopay amount={Number(selectedChair.price * selectedQuantity)}/>;
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
                    fontFamily: 'mont'
                }}
            >
                <div style={{ width: '19%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{ borderRight: '1px solid black',
                            height: '80%', top: '10%',
                            position: 'absolute', left: '20%' }}></div>
                        <h1>결제하기</h1>
                    </div>
                </div>

                <div style={{ width: '44%', textAlign: 'left' }}>
                    <p>{show.name}</p>
                </div>

                <div style={{ width: '32%', textAlign: 'left'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{ borderRight: '1px solid black', height: '80%',top: '10%',
                                        position: 'absolute', left: '66.7%'}}></div>
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
                    fontFamily: 'mont'
                }}
            >
                <div style={{ padding: '5px', maxHeight: '80vh', width: '31%', textAlign: 'left'}}>
                    <h1 style={{borderBottom: '1.5px solid black', fontSize: '15px'}}>티켓 수령방법</h1>
                    <div className="form-check" style={{ backgroundColor: 'lightgray', borderRadius: '5px',
                                                            height: '55px', padding: '5px'}}>
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                        <input className="form-check-input" type="radio" name="flexRadioDefault1"
                                                            id="flexRadioDefault2" checked />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            현장수령
                        </label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <input className="form-check-input" type="radio" name="flexRadioDefault1"
                                                                id="flexRadioDefault1" disabled />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            모바일 티켓
                        </label>
                        </div>
                    </div>
                    <br />
                    <br />
                    <h1 style={{borderBottom: '1.5px solid black', fontSize: '15px'}}>결제 방식 선택</h1>
                    <div className="form-check" style={{ backgroundColor: 'lightgray', borderRadius: '5px',
                                                            height: '105px', padding: '5px' }} >

                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
                        <input className="form-check-input"
                               type="radio"
                               name="flexRadioDefault2"
                               id="flexRadioDefault2"
                               checked={paymentMethod === 'kakao'}
                               onChange={() => setPaymentMethod('kakao')}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            카카오페이
                        </label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
                        <input className="form-check-input"
                               type="radio"
                               name="flexRadioDefault2"
                               id="flexRadioDefault2"
                               checked={paymentMethod === 'bank'}
                               onChange={() => setPaymentMethod('bank')}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            무통장 입금
                        </label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
                        <input className="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault1" disabled />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            신용카드
                        </label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <input className="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault1" disabled />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            휴대폰 결제
                        </label>
                        </div>
                    </div>
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
                    <h1 style={{ fontSize: '15px'}}>
                        {paymentMethod === 'kakao'
                        ? <div> {Number(selectedChair.price * selectedQuantity).toLocaleString()}원 결제 예정입니다.
                                <br /><br /> 결제하기 버튼을 눌러주세요! </div>
                            :
                            <div style={{ padding: '10px', maxHeight: '80vh', width: '90%', textAlign: 'left' }}>
                                <p style={{ padding: '6px', borderBottom: '2px solid darkgray' }}>
                                    결제 수단 입력
                                </p>
                                <p style={{ width: '93%', backgroundColor: 'lightgray', padding: '6px',
                                    borderRadius: '5px', marginTop: '-13px', marginLeft: '1px'}}> > 무통장 입금 </p>
                                <table style={{ borderBottom: '2px solid darkgray', marginTop: '-15px' }}>
                                    <tbody>
                                    <tr style={{ height: '110px' }}>
                                        <th style={{ textAlign: 'center', backgroundColor: 'lightgray',
                                            width: '31%', borderRadius: '5px' }}>
                                            입금액<br /><br />
                                            <p style={{ fontSize: '13', padding: '3px' }}>입금 하실 은행</p>
                                        </th>
                                        <td style={{ textAlign: 'right', padding: '8px' }}>
                                            {Number(selectedChair.price * selectedQuantity).toLocaleString()}원
                                            <br /><br />

                                            <div ref={dropDownRef}>
                                                <button
                                                    onClick={() => setIsOpen(!isOpen)}
                                                    style={{ padding: '5px', cursor: 'pointer',
                                                        border: 'none' ,borderRadius: '5px'}}
                                                >
                                                    {identify}
                                                </button>
                                                {isOpen &&
                                                    <div style={{cursor: 'pointer'}}>
                                                        {list.map((value) => (
                                                            <Dropdown
                                                                key={value}
                                                                value={value}
                                                                setIsOpen={setIsOpen}
                                                                setIdentify={handleBankSelection}
                                                                isOpen={isOpen} />
                                                        ))}
                                                    </div>
                                                }
                                            </div>
                                            {generatedNumber &&
                                                <div style={{ marginTop: '5px', fontSize: '15px' }}>
                                                    계좌번호: {generatedNumber}
                                                </div>}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {alertMessage && (
                                    <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                                        {alertMessage}
                                    </div>
                                )}
                            </div>
                            }
                    </h1>
                </div>
                <div
                    style={{
                        borderRight: '1px solid gray',
                        height: '90%',
                        width: '1%',
                    }}
                ></div>
                <div style={{ padding: '10px', maxHeight: '80vh', width: '30%', textAlign: 'left'}}>
                    <p style={{padding: '6px', backgroundColor: 'lightgray', borderBottom: '2px solid darkgray', borderRadius: '10px', marginBottom: '1px'}}>　</p>
                    <table>
                        <tbody>
                        <tr style={{height: '150px'}}>
                            <th style={{ textAlign: 'center', backgroundColor: 'lightgray', width: '27%', borderRadius: '5px'}}>
                                공연 <br /><br /><br />
                                장소 <br /><br />
                                좌석
                            </th>
                            <td style={{ textAlign: 'center', width: '80%', padding: '15px'}}>
                                {show.name}<br /><br />
                                {show.place} <br /><br />
                                {selectedChair && selectedChair.chairType}석 {selectedQuantity}매
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br />
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button
                            style={{
                                padding: '10px 12px',
                                backgroundColor: '#ff9898',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                width: '250px',
                                height: '45px',
                                fontSize: '15px',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#ff7b7b';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#ff9898';
                            }}
                            onClick={handlePayment}
                        >결제하기</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;