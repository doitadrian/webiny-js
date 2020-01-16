import { connect } from "@webiny/app-page-builder/editor/redux";
import { getPlugins } from "@webiny/plugins";
import { getActiveElement } from "@webiny/app-page-builder/editor/selectors";
import { PbPageElementAdvancedSettingsPlugin } from "@webiny/app-page-builder/admin/types";

const AdvancedAction = ({ elementType, children }) => {
    const plugins = getPlugins<PbPageElementAdvancedSettingsPlugin>(
        "pb-page-element-advanced-settings"
    );

    if (!plugins.some(pl => pl.elementType === elementType)) {
        return null;
    }

    return children;
};

export default connect<any, any, any>(state => ({ elementType: getActiveElement(state).type }))(
    AdvancedAction
);