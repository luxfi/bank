import { PropsWithChildren, useEffect } from "react";
import { Location, Navigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Spinner } from "../../components/Spinner";
import { User } from "./AuthApi";
import { checkAuth, selectAuthStatus, selectCurrentUser } from "./AuthSlice";
import { AdminRoles, UserRole } from "./user-role.enum";
import { setActiveState } from "./ViewCarouselSlice";
interface Props {
    roles?: UserRole[];
}

export default function RequireAuth(props: PropsWithChildren<Props>) {
    const currentUser = useAppSelector(selectCurrentUser);
    const location = useLocation();
    const isLoading = useAppSelector(selectAuthStatus) === "loading";
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(checkAuth());
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (!currentUser) {
        if (location.pathname.startsWith("/registration/documents")) {
            return <Navigate to="/" replace />;
        }

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!location.pathname.includes("/2fa") && Array.isArray(props.roles) && !props.roles.includes(currentUser.role)
    ) {
        return <Navigate to="/" replace />;
    }

    // check user's registration.
    if (!AdminRoles.includes(currentUser.role)) {
        const nextStep = getNextRegistrationStep(currentUser, location);
        if (nextStep !== null) {
            dispatch(setActiveState({ activeState: 1 }));
            return nextStep;
        }
    }
    // console.log(currentUser);

    return <>{props.children}</>;
}

/** checks the user's registration and returns the next step if it's not done. */
const getNextRegistrationStep = (currentUser: User, location: Location) => {
    // if the user doesn't have their metadata set up.
    if (
        !currentUser.isMetadataSet &&
        !location.pathname.startsWith("/registration")
    ) {
        return (
            <Navigate
                to="/registration/metadata"
                state={{ from: location }}
                replace
            />
        );
    }

    // if the metadata is set but the user didn't accept the terms and conditions.
    /*
    if (currentUser.isMetadataSet && !currentUser.hasAcceptedTerms && !location.pathname.startsWith('/terms')) {
        return <Navigate to='/terms' state={{ from: location }} replace />;
    }*/

    // avoid loading registration screens for logged in users.
    if (
        currentUser.isMetadataSet &&
        (location.pathname.startsWith("/registration") ||
            location.pathname.startsWith("/login"))
    ) {
        return <Navigate to="/" replace />;
    }

    return null;
};

const LoadingContainer = styled.section`
    padding: 100px;
`;

export function Loading() {
    return (
        <LoadingContainer>
            <Spinner size="large" />
        </LoadingContainer>
    );
}
