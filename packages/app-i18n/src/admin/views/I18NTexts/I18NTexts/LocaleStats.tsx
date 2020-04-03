import React from "react";
import { css } from "emotion";

const style = {
    wrapper: css({ display: "inline-block", width: 200, padding: "0 5px" }),
    label: css({}),
    bar: {
        wrapper: css({
            background: "#cfcfcf",
            width: "100%",
            height: 30,
            position: ["relative"]
        }),
        bar: css({
            background: "#3bb5a1",
            position: ["absolute"],
            height: 30
        }),
        text: css({
            color: "white",
            position: ["absolute"],
            width: "100%",
            textAlign: "center"

        })
    }
};

const LocaleStats = ({ data }) => {
    return (
        <div className={style.wrapper}>
            <div className={style.label}>{data.locale.code}</div>
            <div className={style.bar.wrapper}>
                <div className={style.bar.bar} style={{ width: data.percentage + "%" }} />
                <div className={style.bar.text}>{data.percentage + "%"}</div>
            </div>
        </div>
    );
};

export default LocaleStats;
