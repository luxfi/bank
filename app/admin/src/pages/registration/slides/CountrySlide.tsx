import React from "react";
import { Formik, FormikHelpers } from "formik";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import InputField from "../../../components/InputField";
import SelectInputField from "../../../components/SelectInputField";
import {
    CountrySlideDto,
    countrySlideSchema,
} from "../../../features/registration/model/countrySlideSchema";
import {
    EntityType,
    selectRegistrationType,
    setCountrySlideInfo,
} from "../../../features/registration/RegistrationSlice";
import BaseSlide, { StyledForm } from "./BaseSlide";
import EntityTypeSlide from "./EntityTypeSlide";
import { businessRoles } from "../../../features/registration/model/businessRoles";
import { countries, countriesToSelect } from "../../../features/registration/model/countries";
import MobileVerificationSlide from "./MobileVerificationSlide";
import { countrySlideInitialValues } from "../../../features/registration/model/countrySlideInitialValues";
import { SlideProps } from "../helpers/slide-types";
import { SlideButton } from "../components/SlideButton";
import { useQuery } from "../../../utils/use-query";
import BasicInfoSlide from "./BasicInfoSlide";
import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";
import { NextButton } from "../../../components/Containers";
import { companyTypes } from "../../../features/beneficiaries/model/entity-types";

function getBusinessRoleFields(formik: any) {
    return (
        <>
            <SelectInputField
                name="companyType"
                labeltext="Company Type"
                options={companyTypes}
            />
            <SelectInputField
                name="businessRoleSelect"
                labeltext="Your role"
                options={businessRoles}
            />
            {formik.values.businessRoleSelect === "other" ? (
                <InputField
                    name="businessRole"
                    labeltext="If other please specify"
                />
            ) : null}
        </>
    );
}

export default function CountrySlide({ goToSlide }: SlideProps) {

    const dispatch = useAppDispatch();
    const entityType = useAppSelector(selectRegistrationType);
    const isBusinessRegistration = entityType === EntityType.Business;
    // const isIndividualRegistration = entityType === EntityType.Individual;
    const query = useQuery();
    const invitationUuid = query.get("invitation");
    const prevSlide = !invitationUuid ? EntityTypeSlide : BasicInfoSlide;
    const onSubmit = async (
        values: CountrySlideDto,
        formik: FormikHelpers<CountrySlideDto>
    ) => {
        dispatch(setCountrySlideInfo(values));
        isBusinessRegistration
            ? dispatch(setActiveState({ activeState: 1 }))
            : dispatch(setActiveState({ activeState: 0 }));

        goToSlide(MobileVerificationSlide);
    };
    return (
        <>
            <IndividualButton>
                <CircleRegion>
                    <button
                        onClick={() => goToSlide(prevSlide)}
                        style={{
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            position: "relative",
                            paddingTop: "9px",
                        }}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/images/larrow.svg`}
                            alt="Prev"
                        />
                    </button>
                </CircleRegion>
            </IndividualButton>
            <BaseSlide
                key="country-slide"
                title="Please select your country of registration"
                sort="padding-top"
            >
                <Formik
                    initialValues={countrySlideInitialValues}
                    validationSchema={countrySlideSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <StyledForm>
                            <Container>
                                <SelectInputField
                                    name="country"
                                    labeltext="Your country: "
                                    placeholder="Select a country"
                                    options={countriesToSelect}
                                />
                                {isBusinessRegistration
                                    ? getBusinessRoleFields(formik)
                                    : null}
                            </Container>
                            <NextButton>
                                <SlideButton secondary type="submit">
                                    Next
                                </SlideButton>
                            </NextButton>
                        </StyledForm>
                    )}
                </Formik>
            </BaseSlide>
        </>
    );
}
const Container = styled.div`
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background-color: ${(props) => props.theme.colors.bg};
        padding: 0 30px 20px 30px;
    }
`;
const IndividualButton = styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 10px;
    border-radius: 100%;
`;

const CircleRegion = styled.div`
    @media (max-width: 768px) {
        display: flex;
        transform: translate(50px, 70px);
        justify-content: flex-start;
    }
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.colors.bgrey};
`;
