import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import BaseSlide from "../../../registration/slides/BaseSlide";
import {
    selectCurrencyConvert,
    selectQuoteData,
} from "../../../../features/accountview/ViewCurrencySlice";
import {
    dateToHuman,
    snakeCaseToHumanCase,
} from "../../../../utils/text-helpers";
import { SlideProps } from "../../../registration/helpers/slide-types";
import CurrencyConvert from "./CurrencyConvert";
import { setActiveState } from "../../../../features/auth/ViewCarouselSlice";
import moment from "moment";
export default function CurrencyComplete({
    goToSlide,
    selectedSlide,
}: SlideProps) {
    const currencyConvert = useAppSelector(selectCurrencyConvert);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const quote = useAppSelector(selectQuoteData);
    return (
        <BaseSlide key="currency-quote" title="empty" sort="payment">
            <Container>
                <>
                    <RowContainer>
                        <BorderLabel>
                            <NextButton>
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/currencies/check.svg`}
                                    width="30px"
                                    height="30px"
                                    alt="pending"
                                />
                            </NextButton>
                            <LargeTitle>
                                Great, conversion of {quote.client_sell_amount}{" "}
                                {quote.sell_currency} to{" "}
                                {quote.client_buy_amount} {quote.buy_currency},
                                was successful!
                            </LargeTitle>
                        </BorderLabel>
                    </RowContainer>
                </>
                <>
                    <RowBetweenContainer>
                        <LargeTitle>Conversion</LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <TableContainer style={{ width: "100%" }}>
                            <tbody style={{ width: "100%" }}>
                                <tr>
                                    <th>Sold:</th>
                                    <td>
                                        {quote.client_sell_amount}{" "}
                                        {quote.sell_currency}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Bought:</th>
                                    <td>
                                        {quote.client_buy_amount}{" "}
                                        {quote.buy_currency}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Status:</th>
                                    <td>
                                        <p>
                                            {snakeCaseToHumanCase(quote.status)}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Created Date:</th>
                                    <td>
                                        <p>{dateToHuman(quote.created_at)}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Settlement Date:</th>
                                    <td>
                                        <p>
                                            {dateToHuman(quote.settlement_date)}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Conversion Date:</th>
                                    <td>
                                        <p>
                                            {dateToHuman(
                                                quote.conversion_date,
                                                false
                                            )}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Reference #: </th>
                                    <td>
                                        <p>{quote.short_reference}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </TableContainer>
                    </RowContainer>
                    <RowContainer>
                        <ItemContainer>
                            {quote.deposit_required && (
                                <p>
                                    {quote.deposit_amount}{" "}
                                    {quote.deposit_currency} deposit is required
                                    for this conversion
                                </p>
                            )}
                        </ItemContainer>
                    </RowContainer>
                </>
                <>
                    <RowBetweenContainer>
                        <LargeTitle>Rates</LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <TableContainer style={{ width: "100%" }}>
                            <tbody style={{ width: "100%" }}>
                                <tr>
                                    <th>Your Exchange Rate:</th>
                                    <td>
                                        {quote.client_rate} (Inverse:{" "}
                                        {Math.round(
                                            10000 / Number(quote.client_rate)
                                        ) / 10000}
                                        ) on {dateToHuman(quote.created_at)}
                                    </td>
                                </tr>
                            </tbody>
                        </TableContainer>
                    </RowContainer>
                </>
                <ButtonRow>
                    <Button
                        primary
                        style={{
                            padding: "5px 20px",
                            margin: "10px 10px",
                            borderRadius: "5px",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(setActiveState({ activeState: 0 }));
                            navigate(
                                `/dashboard/payments/wizard/${currencyConvert.buy_account_id}?conversion_id=${quote.id}`
                            );
                        }}
                    >
                        Make Payment
                    </Button>
                    <Button
                        primary
                        style={{
                            padding: "5px 20px",
                            margin: "10px 10px",
                            borderRadius: "5px",
                        }}
                        onClick={(e) => {
                            navigate(
                                `/dashboard/balances/${quote.buy_currency}/transactions/${currencyConvert.buy_account_id}`
                            );
                        }}
                    >
                        Pay Later
                    </Button>
                    <Button
                        primary
                        style={{
                            padding: "5px 20px",
                            margin: "10px 10px",
                            borderRadius: "5px",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            goToSlide(CurrencyConvert);
                            location.reload();
                        }}
                    >
                        Make Another Conversion
                    </Button>
                    <Button
                        primary
                        style={{
                            padding: "5px 20px",
                            margin: "10px 10px",
                            borderRadius: "5px",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/dashboard/");
                        }}
                    >
                        View Dashboard
                    </Button>
                </ButtonRow>
            </Container>
        </BaseSlide>
    );
}

const BorderLabel = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    border: 1px solid ${(props) => props.theme.colors.secondary};
    padding: 15px;
    border-radius: 5px;
    align-items: center;
`;
const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 10px 0px 10px 0px;
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 10px;
    align-items: center;
`;
const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    @media (max-width: 1350px) {
        justify-content: space-around;
        flex-wrap: wrap;
    }
`;
const PaddingContainer = styled.div`
    padding-left: 20px;
    color: ${(props) => props.theme.colors.detail};
    margin-bottom: 5px;
`;
const NextButton = styled.div`
    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    @media (max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
    align-items: center;
`;
const LargeTitle = styled.h2`
    padding: 10px auto;
    margin: 0;
    margin-left: 20px;
`;
const RowBetweenContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const ItemContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 0px 20px 0px 30px;
    text-align: left;
`;
const TableContainer = styled.table`
    @media (min-width: 1023px) {
        margin-left: 26px;
    }
    margin-top: 10px;
    margin-bottom: 10px;
    tr {
        flex: 1;
        width: 100%;
        text-align: left;
        th {
            width: 50%;
        }
        td {
            width: 50%;
        }
    }
`;
