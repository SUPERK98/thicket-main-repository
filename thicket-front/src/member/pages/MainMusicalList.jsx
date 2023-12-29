import {
    DivList1,
    H1,
    Img1,
    ImgInfo1,
    InvisibleScroll,
    MainContainer,
    Poster1,
    Wrapper,
} from "../../assets/css/setting/MainStyleCSS";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const ShowList = () => {
    const [shows, setShows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/thicket-show/shows/stagetype/MUSICAL')
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
            {Array.isArray(shows) > 0 ? (
                shows.map(show => (
                    <Poster1 key={show.stageId} onClick={() => navigate(`/detail/${show.stageId}`)}>
                        <Img1 src={show.posterImg} alt="Poster" />
                        <ImgInfo1>
                            <div>{show.name}</div>
                            <div>{show.place}</div>
                            <div>{`${formatDateString(show.stageOpen)} ~ ${formatDateString(show.stageClose)}`}</div>
                        </ImgInfo1>
                    </Poster1>
                ))
            ) : (
                // <H1>없습니다.　　　　　　　　아니 그냥 없어요.</H1>
                <img src={'https://cdn.newskrw.com/news/photo/202211/1788_1894_1131.png'} alt="Entity Not Found" />
            )}
        </DivList1>
    );
};

function MainMusicalList() {

    return (
        <Wrapper>
            <InvisibleScroll>
                <MainContainer>
                    <H1>진행중인 뮤지컬 목록</H1>
                    <ShowList />
                </MainContainer>
            </InvisibleScroll>
        </Wrapper>
    );
};

export default MainMusicalList;