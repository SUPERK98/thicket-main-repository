import React, {useEffect, useRef, useState} from 'react';
import {registerLocale} from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import {
    BetweenDiv,
    Button,
    Button1,
    ButtonX,
    CalendarSVG,
    CalenderDiv,
    Container,
    CustomDiv,
    FlexCenterDiv,
    H1,
    ImageViewerModal,
    Img,
    Input,
    InputFile,
    P,
    RelativeDiv,
    Select,
    StyledDatePicker,
    Table,
    Td,
    Textarea,
    Th,
    TimeDiv,
    WidthDiv,
} from '../../assets/css/setting/admin/StylesOfCreate';
import ImageFileHandling from "../../assets/css/setting/admin/ImageFileHandling";
import RegistrationSchedule from "../../assets/css/setting/admin/RegistrationSchedule";
import RegistrationSeat from "../../assets/css/setting/admin/RegistrationSeat";
import DeleteSchedule from "../../assets/css/setting/admin/DeleteSchedule";
import DeleteSeat from "../../assets/css/setting/admin/DeleteSeat";

const AdminCreateShow = () => {
    const [showTitle, setShowTitle] = useState(""); // 공연 제목
    const [showAddress, setShowAddress] = useState(""); // 공연장 주소
    const [startDate, setStartDate] = useState(null);   // 전체 시작일
    const [endDate, setEndDate] = useState(null); // 전체 종료일
    const [ticketOpen, setTicketOpen] = useState(null);
    const [lastTicket, setLastTicket] = useState(null);
    const [showDuring, setShowDuring] = useState(""); // 공연 시간
    const [ageLimit, setAgeLimit] = useState(""); // 연령 제한
    const [selectedPerformanceType, setSelectedPerformanceType] = useState(''); // 공연 종류
    const [detailText, setDetailText] = useState(""); // 상세 텍스트
    const [showId, setShowId] = useState("");

    const startDatePickerRef = useRef(null); // 전체 시작일 달력
    const endDatePickerRef = useRef(null); // 전체 종료일 달력
    const ticketOpenPickerRef = useRef(null);
    const lastTicketPickerRef = useRef(null);
    const [hasExistingSchedules, setHasExistingSchedules] = useState(false); // 달력 비활성화
    const [hasStartDate, setHasStartDate] = useState(true);
    const [hasEndDate, setHasEndDate] = useState(true);
    const [hasShowId, setHasShowId] = useState(false);

    const { // 공연포스터 이미지, 상세페이지 이미지
        uploadedFiles, selectedImage, fileInputRef,
        handleFileUpload, handleRemoveFile, handleImageClick, handleCloseModal,
        uploadedDetailImages, selectedDetailImage, detailImageInputRef,
        handleDetailImageUpload, handleRemoveDetailImage, handleDetailImageClick, handleCloseDetailImageModal,
    } = ImageFileHandling();
    const { // 일별 시작 시간
        timeSlots, setTimeSlots,
        handleRemoveDateTime, handleRemoveTime, handleRemoveAllTimeSlots,
    } = DeleteSchedule();
    const  { // 좌석
        seatValues, setSeatValues,
        handleRemoveSeat,
    } = DeleteSeat();

    // 달력 한글화
    registerLocale('ko', ko);

    // 달력 부분 비활성화
    useEffect(() => {
        if (timeSlots.length > 0) {
            setHasExistingSchedules(true);
        } else {
            setHasExistingSchedules(false);
        }
    }, [timeSlots]);

    useEffect(() => {
        setHasShowId(showId !== "");
    }, [showId]);

    // 일별 시작 시간 일정추가 버튼 (유효성 검사 포함)
    const handleAddTimeButtonClick = () => {
        if (!startDate || !endDate || startDate === 'Invalid Date' || endDate === 'Invalid Date') {
            alert('개막일과 폐막일을 먼저 선택하세요.');
            return;
        }
        const newRoot = document.createElement('div'); // 새로운 루트 엘리먼트 생성
        const newRootInstance = createRoot(newRoot); // 새로운 루트 인스턴스 생성
        const newWindow = window.open('', '_blank', 'width=240,height=210,left=100,top=100');
        newWindow.document.body.appendChild(newRoot); // 새 창에 추가

        newRootInstance.render(
            <RegistrationSchedule
                startDate={startDate}
                endDate={endDate}
                onConfirm={(selectedDateTime) => {
                    const { date, times } = selectedDateTime;

                    // 각 시간 항목의 유효성 검사
                    const isValidTime = times.every((time) => {
                        const hour = parseInt(time.hour, 10);
                        const minute = parseInt(time.minute, 10);

                        return (hour >= 0 && hour <= 23) && (minute === 0 || minute === 30);
                    });

                    if (!isValidTime) {
                        alert('유효하지 않은 시간입니다.');
                        newWindow.close(); // 새 창 닫기
                        return;
                    }

                    // 기존 날짜 인덱스 찾기
                    const existingDateIndex = timeSlots.findIndex((item) => item.date === date);

                    if (existingDateIndex !== -1) {
                        // 동일한 날짜 내 중복 시간 확인
                        const isDuplicateTime = timeSlots[existingDateIndex].times.some(
                            (time) =>
                                time.hour === times[0].hour &&
                                time.minute === times[0].minute
                        );

                        if (isDuplicateTime) {
                            alert('이미 동일한 시간이 추가되었습니다.');
                        } else {
                            setTimeSlots((prevTimeSlots) => {
                                const updatedTimeSlots = [...prevTimeSlots];
                                updatedTimeSlots[existingDateIndex].times.push({
                                    hour: times[0].hour,
                                    minute: times[0].minute,
                                });
                                return updatedTimeSlots;
                            });
                        }
                    } else {
                        // 동일한 날짜 확인
                        const isDuplicateDate = timeSlots.some((item) => item.date === date);

                        if (isDuplicateDate) {
                            alert('이미 동일한 날짜가 추가되었습니다.');
                        } else {
                            setTimeSlots((prevTimeSlots) => [...prevTimeSlots, { date, times }]);
                        }
                    }
                    newWindow.close(); // 새 창 닫기
                }}
            />
        );
    };

    // 좌석 추가 버튼
    const handleAddButtonClick = () => {
        const newRoot = document.createElement('div'); // 새로운 루트 엘리먼트 생성
        const newRootInstance = createRoot(newRoot); // 새로운 루트 인스턴스 생성
        const newWindow = window.open('', '_blank', 'width=280,height=240,left=100,top=100');
        newWindow.document.body.appendChild(newRoot); // 새 창에 루트 엘리먼트 추가

        newRootInstance.render(
            <RegistrationSeat
                onSubmit={(enteredValues) => {
                    const formattedValues = enteredValues.reduce((acc, curr) => {
                        const formattedValue =
                            curr.label === '타입' ? String(curr.value) : parseInt(curr.value, 10) || 0;
                        acc.push({ label: curr.label, value: formattedValue });
                        return acc;
                    }, []);

                    const isDuplicateType = seatValues.some((values) => values[0].value === formattedValues[0].value);

                    if (isDuplicateType) {
                        alert('이미 동일한 타입의 좌석이 추가되었습니다.');
                        newWindow.close(); // 새 창 닫기
                    } else {
                        setSeatValues((prevSeatValues) => [...prevSeatValues, formattedValues]);
                        newWindow.close(); // 새 창 닫기
                    }
                }}
            />
        );
    };
    function submitNewShow() {
        let posterImageLink = ""; // 포스터 이미지 링크
        let detailImageLink = []; // 디테일 이미지 링크 배열
        let formData = new FormData();
        uploadedFiles
            .forEach((img, index) => formData.append(`images`,img));
        uploadedDetailImages
            .forEach((img, index) => formData.append(`images`,img));

        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem('token')
            },
            body: formData
        };

        fetch("/thicket-show/shows/image", requestOptions)
        .then(response => response.text())
        .then(result => {
            const urls = JSON.parse(result);
            urls.forEach((url, index) => {
                if (index === 0) {
                    posterImageLink = url;
                } else {
                    detailImageLink.push(url);
                }
            });
        })
        .then(() => {
            fetch("/thicket-show/shows", {
                method: 'POST',
                body: JSON.stringify({
                    name: showTitle,
                    place: showAddress,
                    ticketOpen: ticketOpen,
                    stageOpen: startDate,
                    stageClose: endDate,
                    lastTicket: lastTicket,
                    runningTime: showDuring,
                    ageLimit: ageLimit,
                    stageType: selectedPerformanceType,
                    imgLink: posterImageLink,
                    detailImgLink: detailImageLink,
                    stageInfo: detailText
                }),
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": localStorage.getItem('token')
                }
            })
            .then(response => {
                response.status === 201 ? alert("공연 등록 성공") : alert("공연 등록 성공")
                return response.text()
            }).then((result) => {
                setShowId(result);
            })
            .catch(error => console.log(error));
        });
    }

    const submitTimeSlot = () => {
        // 중복 등록 방지를 위한 비교를 위해 hour과 minute으로 나뉘어져 있는 times를 하나의 문자열로 결합시키는 구문
        let stageStart = [];
        timeSlots.forEach((dateTime) => {
            dateTime.times
                .map(({hour, minute}) =>
                    stageStart.push({ date : dateTime.date, time : hour + ":" + minute}));
        });

        fetch("/thicket-show/tickets", {
            method: 'POST',
            body: JSON.stringify({
                stageId: showId,
                stageStartDtos:stageStart
            }),
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem('token')
            }
        }).then(response => response.text())
        .then(result => alert(result))
        .catch(error => console.log(error));
    };
    const submitChair = () => {
        // [{vip, 50, 10000},{vip, 50, 10000},{vip, 50, 10000}]
        // seatValues.map(seat => {
        // })
        const chairs = seatValues.map(seat => {
            const cleanNode = seat.map((node) => {
                switch (node.label) {
                    case '타입':
                        return {chairType: node.value}
                    case '개수':
                        return {count: node.value}
                    default:
                        return {price: node.value}
                }
            });
            return cleanNode.reduce((result, currentObj) => Object.assign(result,currentObj));
        });
        console.log(showId)
        fetch("/thicket-show/chairs", {
            method: 'POST',
            body: JSON.stringify({
                stageId: showId,
                chairDtos:chairs
            }),
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem('token')
            }
        }).then(response => response.text())
            .then(result => alert(result))
            .catch(error => console.log(error));
    };
    return (
        <Container>
            <div>
                <H1>공연 등록</H1>
                <Table>
                    <tbody>
                    <tr>
                        <Th>제목</Th>
                        <Td>
                            <Input placeholder="제목을 입력하세요."
                                   onChange={(e) => setShowTitle(e.target.value)}
                                   disabled={hasShowId}/>
                        </Td>
                    </tr>
                    <tr>
                        <Th>공연장 주소</Th>
                        <Td>
                            <Input placeholder="공연장을 입력하세요."
                                   onChange={(e) => setShowAddress(e.target.value)}
                                   disabled={hasShowId}/>
                        </Td>
                    </tr>
                    <tr>
                        <Th>개 막 일</Th>
                        <Td>
                            <RelativeDiv>
                                <StyledDatePicker
                                    ref={startDatePickerRef}
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date)
                                        setHasStartDate(false);
                                    }}
                                    dateFormat="yyyy년 MM월 dd일"
                                    placeholderText="  날짜를 선택하세요."
                                    locale="ko"
                                    maxDate={endDate} // 종료일 이후로 선택 불가능
                                    disabled={hasExistingSchedules || hasShowId} // 일정이 있으면 비활성화
                                />
                                <CalenderDiv onClick={() => startDatePickerRef.current && startDatePickerRef.current.setOpen(true)}>
                                    <CalendarSVG />
                                </CalenderDiv>
                                <P>하단의 일정을 등록한 상태에서는 달력이 비활성화됩니다.</P>
                            </RelativeDiv>
                        </Td>
                    </tr>
                    <tr>
                        <Th>폐 막 일</Th>
                        <Td>
                            <RelativeDiv>
                                <StyledDatePicker
                                    ref={endDatePickerRef}
                                    selected={endDate}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setHasEndDate(false);
                                    }}
                                    dateFormat="yyyy년 MM월 dd일"
                                    placeholderText="  날짜를 선택하세요."
                                    locale="ko"
                                    minDate={startDate} // 시작일 이전으로 설정 불가능
                                    disabled={hasExistingSchedules || hasShowId} // 일정이 있으면 비활성화
                                />
                                <CalenderDiv onClick={() => endDatePickerRef.current && endDatePickerRef.current.setOpen(true)}>
                                    <CalendarSVG />
                                </CalenderDiv>
                                <P>
                                    수정이 필요할 경우 일정을 전부 삭제해 주세요.
                                    <Button onClick={handleRemoveAllTimeSlots}>일정 전체 삭제</Button>
                                </P>
                            </RelativeDiv>
                        </Td>
                    </tr>
                    <tr>
                        <Th>예매 시작일</Th>
                        <Td>
                            <RelativeDiv>
                                <StyledDatePicker
                                    ref={ticketOpenPickerRef}
                                    selected={ticketOpen}
                                    onChange={(date) => setTicketOpen(date)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    placeholderText="  날짜를 선택하세요."
                                    locale="ko"
                                    maxDate={startDate} // 시작일 이전만 선택 가능
                                    disabled={hasStartDate || hasShowId}
                                    // 시작 날짜를 골라야 예약 시작 날짜를 고를 수 있음.
                                />
                                <CalenderDiv onClick={() => ticketOpenPickerRef.current && ticketOpenPickerRef.current.setOpen(true)}>
                                    <CalendarSVG />
                                </CalenderDiv>
                                <P> 전체 공연 종료일을 먼저 선택해 주세요.</P>
                            </RelativeDiv>
                        </Td>
                    </tr>
                    <tr>
                        <Th>예매 종료일</Th>
                        <Td>
                            <RelativeDiv>
                                <StyledDatePicker
                                    ref={lastTicketPickerRef}
                                    selected={lastTicket}
                                    onChange={(date) => setLastTicket(date)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    placeholderText="  날짜를 선택하세요."
                                    locale="ko"
                                    minDate={startDate}
                                    maxDate={endDate} // 시작일 이전만 선택 가능
                                    disabled={hasEndDate || hasShowId}
                                />
                                <CalenderDiv onClick={() => lastTicketPickerRef.current && lastTicketPickerRef.current.setOpen(true)}>
                                    <CalendarSVG />
                                </CalenderDiv>
                                <P> 전체 공연 종료일을 먼저 선택해 주세요.</P>
                            </RelativeDiv>
                        </Td>
                    </tr>
                    <tr>
                        <Th>공연 시간</Th>
                        <Td>
                            <RelativeDiv>
                                <Input placeholder="러닝타임을 입력하세요."
                                       onChange={(e) => setShowDuring(e.target.value)}
                                       disabled={hasShowId}/>
                                <P> 인터미션 등의 특이사항도 함께 적어주세요. </P>
                            </RelativeDiv>
                        </Td>
                    </tr>
                    <tr>
                        <Th>관람 연령</Th>
                        <Td>
                            <Input placeholder="관람 가능 연령을 입력하세요."
                                   onChange={(e) => setAgeLimit(e.target.value)}
                                   disabled={hasShowId} />
                        </Td>
                    </tr>
                    <tr>
                        <Th>공연 종류</Th>
                        <Td>
                            <Select
                                value={selectedPerformanceType}
                                onChange={(e) => setSelectedPerformanceType(e.target.value)}
                                disabled={hasShowId}
                            >
                                <option value="">선택</option>
                                <option value="MUSICAL">뮤지컬</option>
                                <option value="PLAY">연극</option>
                                <option value="CONCERT">콘서트</option>
                            </Select>
                        </Td>
                    </tr>
                    <tr>
                        <Th>공연 메인 포스터</Th>
                        <Td>
                            <InputFile
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                /*disabled={hasShowId}*/
                            />
                            <Button1 onClick={() => fileInputRef.current.click()}>
                                파일선택
                            </Button1>
                        </Td>
                    </tr>
                    {uploadedFiles.map((file, index) => (
                        <tr key={index}>
                            <Th>
                                <BetweenDiv>
                                    포스터 미리보기
                                    <button style={{padding: '0 3px', border: 'darkgray 1px'}} onClick={() => handleRemoveFile()}
                                             /*disabled={hasShowId}*/>
                                        ✕
                                    </button>
                                </BetweenDiv>
                            </Th>
                            <Td>
                                <FlexCenterDiv>
                                    <Img
                                        src={URL.createObjectURL(file)}
                                        alt={`File ${index + 1}`}
                                        onClick={() => handleImageClick(URL.createObjectURL(file))}
                                    />
                                    <P>
                                        {file.name}
                                        <br />
                                        (클릭하여 이미지를 크게 보기)
                                    </P>
                                </FlexCenterDiv>
                            </Td>
                        </tr>
                    ))}
                    {selectedImage && ReactDOM.createPortal(
                        <ImageViewerModal
                            imageUrl={selectedImage}
                            onClose={handleCloseModal}
                        />,
                        document.body
                    )}
                    <tr>
                        <Th>상세페이지 이미지</Th>
                        <Td>
                            <InputFile
                                type="file"
                                ref={detailImageInputRef}
                                onChange={handleDetailImageUpload}
                                // disabled={hasShowId}
                            />
                            <Button1 onClick={() => detailImageInputRef.current.click()}>
                                파일선택
                            </Button1>
                        </Td>
                    </tr>
                    {uploadedDetailImages.map((file, index) => (
                        <tr key={index}>
                            <Th>
                                <BetweenDiv>
                                    미리보기
                                    <button style={{padding: '0 3px', border: 'darkgray 1px'}} onClick={() => handleRemoveDetailImage(index)}
                                             /*disabled={hasShowId}*/>
                                        ✕
                                    </button>
                                </BetweenDiv>
                            </Th>
                            <Td>
                                <FlexCenterDiv>
                                    <Img
                                        src={URL.createObjectURL(file)}
                                        alt={`File ${index + 1}`}
                                        onClick={() => handleDetailImageClick(URL.createObjectURL(file))}
                                    />
                                    <P>
                                        {file.name}
                                        <br />
                                        (클릭하여 이미지를 크게 보기)
                                    </P>
                                </FlexCenterDiv>
                            </Td>
                        </tr>
                    ))}
                    {selectedDetailImage && ReactDOM.createPortal(
                        <ImageViewerModal
                            imageUrl={selectedDetailImage}
                            onClose={handleCloseDetailImageModal}
                        />,
                        document.body
                    )}
                    <tr>
                        <Th>상세페이지 텍스트</Th>
                        <Td>
                            <FlexCenterDiv>
                                <Textarea placeholder="이미지 외 추가설명을 입력하세요."
                                          onChange={(e) => setDetailText(e.target.value)}
                                          disabled={hasShowId}/>
                                <P>텍스트 상자의 오른쪽 하단을 클릭해서<br />입력창을 조절할 수 있습니다.</P>
                            </FlexCenterDiv>
                        </Td>
                    </tr>
                    </tbody>
                </Table>
            </div>
            <CustomDiv>
                <Button onClick={submitNewShow}
                        disabled={hasShowId}>공연 등록</Button>
            </CustomDiv>
            <div>
                <H1>상세 일정 등록</H1>
                <Table>
                    <tbody>
                    <tr>
                        <Th>일별 시작 시간</Th>
                        <Td>
                            <div>
                                <Button1 onClick={handleAddTimeButtonClick}>
                                    일정추가
                                </Button1>
                            </div>
                        </Td>
                    </tr>
                    {timeSlots.map((dateTime, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <Th>
                                    <BetweenDiv>
                                        <div>
                                            {new Date(dateTime.date).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </div>
                                        <ButtonX onClick={() => handleRemoveDateTime(dateTime.date)}>
                                            ✕
                                        </ButtonX>
                                    </BetweenDiv>
                                </Th>
                                <Td>
                                    <FlexCenterDiv>
                                        {dateTime.times.map((time, timeIndex) => (
                                            <TimeDiv key={timeIndex} >
                                                <WidthDiv>{`${time.hour}:${time.minute}`}</WidthDiv>
                                                <ButtonX onClick={() => handleRemoveTime(dateTime.date, time)}>
                                                    ✕
                                                </ButtonX>
                                            </TimeDiv>
                                        ))}
                                    </FlexCenterDiv>
                                </Td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </Table>
            </div>
            <CustomDiv>
                <Button onClick={submitTimeSlot}>일정 등록</Button>
                <Button onClick={handleRemoveAllTimeSlots}>일정 전체 삭제</Button>
            </CustomDiv>
            <div>
                <H1>좌석 등록</H1>
                <Table>
                    <tbody>
                    <tr>
                        <Th>좌석</Th>
                        <Td>
                            <Button1 onClick={handleAddButtonClick}>
                                좌석추가
                            </Button1>
                        </Td>
                    </tr>
                    {seatValues.map((value, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <Th>
                                    <BetweenDiv>
                                        {`타입 : ${value[0].value}석`}
                                        <ButtonX onClick={() => handleRemoveSeat(value[0].value)}>
                                            ✕
                                        </ButtonX>
                                    </BetweenDiv>
                                </Th>
                                <Td>
                                    <div>{`개수 : ${value[1].value}개`}</div>
                                    <div>{`가격 : ${value[2].value}원`}</div>
                                </Td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </Table>
            </div>
            <div style={{ padding: '20px 0 0 0' }}>
                <Button onClick={submitChair}>좌석 등록</Button>
            </div>
        </Container>
    );
};

export default AdminCreateShow;