const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

module.exports = sequelize.define(
    'menu',
    {
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // 路由 name（动态路由用）
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        // 路由 path
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        component: {
            type: DataTypes.STRING,
            allowNull: true
        },
        redirect: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // 菜单显示名称
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        hidden: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        alwaysShow: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        keepAlive: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        params: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sort: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        // 权限标识
        perm: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // 菜单类型：C-目录 M-菜单 B-按钮
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'M'
        },
        // 数据权限范围
        scope: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        // 显示状态：1-显示 0-隐藏
        visible: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
    }
);
