import React, {useState} from 'react';
import Cancel3 from "./Cancel3";

function Cancel2({ ticketId, ticket, closeWindowCallback  }) {
    const [showCancel3, setShowCancel3] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleConfirmClick = () => {
        // 입력된 텍스트가 "예매취소"인 경우에만 Confirm 처리
        if (inputValue.trim().toLowerCase() === '예매취소') {
            setShowCancel3(true);
        }
    };

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {showCancel3 ? (
                <Cancel3 ticketId={ticketId} ticket={ticket} closeWindowCallback={closeWindowCallback} />
            ) : (
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
                        width: '100%',
                    }}
                    >
                        <div>
                            <h1 style={{color: 'white'}}>취소 신청</h1>
                        </div>
                        <div>
                            <h1>확인 절차</h1>
                        </div>
                        <div>
                            <h1 style={{color: 'white'}}>취소 완료</h1>
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
                        alignItems: 'center', // 상하 정렬
                        textAlign: 'center'   // 좌우 정렬
                    }}>
                        <div>
                            <div>정말로 예매를 취소하시겠습니까?</div>
                            <div>취소를 원하시면 "예매 취소"를 입력 후 확인 버튼을 누르세요.</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop:'10px', padding: '5px',  }}>
                        <div>
                            <input style={{padding: '5px', borderRadius: '4px'}}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="예매취소" // Placeholder added here
                            />
                        </div>
                        <div style={{marginLeft:'10px'}}>
                            <button style={{padding: '6px 12px', color: 'white', backgroundColor: 'gray',
                                borderRadius: '4px', border: 'none'}} onClick={handleConfirmClick}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cancel2;