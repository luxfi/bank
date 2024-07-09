import styled from "styled-components";
import Button from "./Button";

export function Paginator({ page = 1, pageCount = 1, setPage }: Props) {
    return <Container>
        Page {page} of {pageCount}
        {
            page > 1
                ? <Button size="small" onClick={() => setPage(page - 1)}>Previous</Button>
                : null
        }

        {
            page < pageCount
                ? <Button size="small" onClick={() => setPage(page + 1)}>Next</Button>
                : null
        }
    </Container>
}

interface Props {
    page: number;
    pageCount: number;
    setPage: (page: number) => void;
}

const Container = styled.div`
margin-top: 24px;
font-size: 0.8em;
display: flex;
width: 100%;
align-items: center;
justify-content: flex-end;
color: ${(props) => props.theme.colors.fg};
`;
