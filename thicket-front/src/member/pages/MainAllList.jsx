import {
    Wrapper,
    InvisibleScroll,
    MainContainer,
    H1,
    DivList1, Poster1, Img1, ImgInfo1, PaddingDiv
} from "../../assets/css/setting/MainStyleCSS";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const ShowList = () => {
    const [shows, setShows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/thicket-show/shows/ongoing')
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
        <DivList1>
            {Array.isArray(shows) && shows.length > 0 ? (
                shows.map(show => (
                    <Poster1 key={show.stageId} onClick={() => navigate(`/detail/${show.stageId}`)}>   
                        <Img1 src={show.posterImg} alt="Poster" />
                        <ImgInfo1>
                            <PaddingDiv>{show.name}</PaddingDiv>
                            <PaddingDiv>{show.place}</PaddingDiv>
                            <PaddingDiv>{`${formatDateString(show.stageOpen)} ~ ${formatDateString(show.stageClose)}`}</PaddingDiv>
                        </ImgInfo1>
                    </Poster1>
                ))
            ) : (
                <H1>현재 진행중인 뮤지컬이 없습니다.</H1>
            )}
        </DivList1>
    );
};

function MainAllList() {

    return (
        <Wrapper>
            <InvisibleScroll>
                <MainContainer>
                    <H1>진행중인 공연 목록</H1>
                        <ShowList />
                </MainContainer>
            </InvisibleScroll>
        </Wrapper>
    )
}

export default MainAllList;