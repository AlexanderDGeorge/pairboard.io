import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";
import { fetchUserDocFromUsername } from "../firebase/user";
import ProfileHeader from "../Profile/ProfileHeader";
import ProfileStats from "../Profile/ProfileStats";
import Loading from "./Loading";
import LinkBar from "../Nav/LinkBar";

export default () => {
    const pathname = useLocation().pathname.slice(6);
    const [user, setUser] = useState<any>(undefined);

    useEffect(() => {
        (async () => {
            const userDoc = await fetchUserDocFromUsername(pathname);
            setUser(userDoc);
        })();
    }, [pathname]);

    console.log(user);

    if (user) {
        return (
            <StyledUser>
                <LinkBar />
                <ProfileHeader user={user} />
                <ProfileStats user={user} />
            </StyledUser>
        );
    } else {
        return <Loading />;
    }
};

const StyledUser = styled.div`
    height: 100%;
    width: 100%;
`;
