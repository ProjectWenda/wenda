import * as React from "react";

type MenuItemProps = React.PropsWithChildren & {
    onClick: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
    children,
    onClick,
}) => {

    return (
        <div onClick={onClick} className="cursor-pointer ml-2">
            {children}
        </div>
    )
}

export default MenuItem