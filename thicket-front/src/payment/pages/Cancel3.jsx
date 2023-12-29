import React, { useEffect, useState } from 'react';

function Cancel3({ ticketId, closeWindowCallback }) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Function to handle the countdown
        const handleCountdown = () => {
            if (countdown === 0) {
                // If countdown reaches 0, close the window
                closeWindowCallback();
            } else {
                // If countdown is not 0, decrement it
                setCountdown((prevCountdown) => prevCountdown - 1);
            }
        };

        // Timer for the countdown
        const countdownTimer = setInterval(handleCountdown, 1000);

        // Cleanup the interval to avoid any potential memory leaks
        return () => clearInterval(countdownTimer);
    }, [countdown, closeWindowCallback]);

    useEffect(() => {
        // Make the DELETE request
        fetch(`/thicket-ticket/reservations/${ticketId}`, {
            method: 'DELETE',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
    }, [ticketId]);

    return (
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
                    <h1 style={{ color: 'white'}}>취소 신청</h1>
                </div>
                <div>
                    <h1 style={{ color: 'white' }}>확인 절차</h1>
                </div>
                <div>
                    <h1>취소 완료</h1>
                </div>
            </div>
            <div style={{
                width: '80%',
                backgroundColor: 'lightgray',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center', // 가로 중앙 정렬
                textAlign: 'center'   // 세로 중앙 정렬
            }}>
                <div>
                    <div>예매취소가 정상적으로 완료되었습니다.</div>
                    <div>예매내역에서 확인 바랍니다.</div>
                    <div>{`${countdown}초후 창이 자동으로 닫힙니다.`}</div>
                </div>
            </div>
        </div>
    );
}

export default Cancel3;