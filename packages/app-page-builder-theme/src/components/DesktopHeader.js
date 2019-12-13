import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "@webiny/app-page-builder/render/components";
import Navigation from "./Navigation";

const DesktopHeader = ({ menuName, logo, name }: { logo: Object, name: string }) => {
    return (
        <div className="webiny-pb-section-header__wrapper hide-on-mobile">
            <div className={"webiny-pb-section-header__logo"}>
                <Link to="/">
                    {logo && logo.src && <img src={logo.src} alt={name} />}{" "}
                    {(!logo || !logo.src) && (
                        <span className={"webiny-pb-section-header__site-name"}>{name}</span>
                    )}
                </Link>
            </div>
            <nav className={"webiny-pb-section-header__navigation"}>
                <Menu slug={menuName} component={Navigation} />
            </nav>
        </div>
    );
};

export default DesktopHeader;
