import { useContext } from "react";
import { I18NContext } from "../contexts/I18N";

export function useI18N() {
    return useContext(I18NContext);
}
