import {
    DivList2,
    H1,
    H2,
    H3,
    H4,
    Img2,
    ImgDivInfo2,
    InvisibleScroll,
    MainContainer,
    Poster2,
    Wrapper,
} from "../../assets/css/setting/MainStyleCSS";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const ShowList = () => {
    const [shows, setShows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/thicket-show/shows/before')
            .then(response => response.json())
            .then(data => {
                setShows(data);
            });
    }, []);

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <DivList2>
            {Array.isArray(shows) > 0 ? (
                shows.map(show => (
                    <Poster2 key={show.stageId} onClick={() => navigate(`/detail/${show.stageId}`)}>
                        <Img2 src={show.posterImg} alt="Poster" />
                        <ImgDivInfo2>
                            <div><H2>{show.name}</H2></div>
                            <div><H3>{show.place}</H3></div>
                            <div><H4>{`${formatDateString(show.ticketOpen)}`}</H4></div>
                        </ImgDivInfo2>
                    </Poster2>
                ))
            ) : (
                <H1>없습니다.　　　　　　　　　　　　　　　아니 그냥 없어요.</H1>
            )}
        </DivList2>
    );
};

function MainOpeningSoon() {

    return (
        <Wrapper>
            <InvisibleScroll>
                <MainContainer>
                    <H1>오픈예정 목록</H1>
                    <ShowList />
                </MainContainer>
            </InvisibleScroll>
            {/*<왼쪽광고>광고</왼쪽광고>*/}
            {/*<오른쪽광고>문의</오른쪽광고>*/}
        </Wrapper>
    );
};

export default MainOpeningSoon;