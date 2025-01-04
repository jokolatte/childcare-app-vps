import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaHome, FaMoneyCheckAlt, FaCog } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { MdReport, MdSettings } from "react-icons/md";
import { BiBookAlt, BiHelpCircle } from "react-icons/bi";
import "./Sidebar.css";
import logo from "../assets/logo.png"; // Expanded logo
import logoCollapsed from "../assets/logo-collapsed.png"; // Collapsed logo

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleMenuClick = (menuName: string) => {
        setExpandedMenu((prev) => (prev === menuName ? null : menuName));
    };

    const menuItems = [
        {
            name: "Dashboard/Home",
            icon: <FaHome />,
            path: "/", // Add path if needed
        },
        {
            name: "Enrollment Management",
            icon: <AiOutlineCalendar />,
            subMenu: [
                { name: "Create/Edit Classroom", path: "/classrooms" },
                { name: "Add Child", path: "/add-child" },
            ],
        },
        {
            name: "Billing and Payments",
            icon: <FaMoneyCheckAlt />,
        },
        {
            name: "Deposits",
            icon: <AiOutlineCalendar />,
        },
        {
            name: "Expenses",
            icon: <BiBookAlt />,
        },
        {
            name: "Reports",
            icon: <MdReport />,
        },
        {
            name: "Admin Panel",
            icon: <FaCog />,
        },
        {
            name: "Settings",
            icon: <MdSettings />,
        },
        {
            name: "Help & Training",
            icon: <BiHelpCircle />,
        },
    ];

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            {/* Logo Section */}
            <div className="logo">
                <img
                    src={isCollapsed ? logoCollapsed : logo}
                    alt="Logo"
                />
            </div>

            {/* Collapse Button */}
            <div className="collapse-button" onClick={toggleSidebar}>
                {isCollapsed ? "Expand" : "Collapse"}
            </div>

            {/* Menu Items */}
            <ul className="menu">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        <div
                            className="menu-item-container"
                            onClick={() =>
                                item.subMenu ? handleMenuClick(item.name) : undefined
                            }
                        >
                            <span className="icon">{item.icon}</span>
                            {!isCollapsed && <span>{item.name}</span>}
                        </div>
                        {item.subMenu && expandedMenu === item.name && (
                            <ul className="sub-menu">
                                {item.subMenu.map((subItem, subIndex) => (
                                    <li key={subIndex} className="sub-menu-item">
                                        <Link to={subItem.path}>{subItem.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
