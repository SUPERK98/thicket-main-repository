import {Container, H1, Table, TableHeaderRow, Td, TdNotCenter} from '../../assets/css/setting/admin/StylesOfList';
import React, {useEffect, useState} from "react";

export const AdminAllStageList = () => {
    const [showList, setShowList] = useState([]);
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers:{
                "Authorization": localStorage.getItem('token')
            }
        };

        fetch("/thicket-show/shows/all", requestOptions)
            .then(response => response.json())
            .then(result => {
                setShowList(result);
            })
    }, []);
    return (
        <Container>
            <div>
                <H1>전체 목록</H1>
                <Table>
                    <tbody>
                    <TableHeaderRow />
                    {Array.isArray(showList) ? showList.map((value, index) => {
                        return (
                        <tr key={index}>
                            <Td>{index}</Td>
                            <Td>{value.stageType}</Td>
                            <TdNotCenter>
                                {value.name}
                            </TdNotCenter>
                            <Td>{value.stageStatus}</Td>
                            <Td>{value.stageOpen}</Td>
                            <Td>{value.stageClose}</Td>
                        </tr>
                        )}):(<tr> <Td colSpan={6}>없음</Td> </tr>)}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};