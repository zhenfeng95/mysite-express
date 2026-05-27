function parseParams(params) {
    if (params === null || params === undefined || params === '') {
        return null;
    }
    if (typeof params === 'object') {
        return params;
    }
    try {
        return JSON.parse(params);
    } catch {
        return null;
    }
}

function normalizeRecord(item) {
    return item.dataValues ? item.dataValues : item;
}

function getRouteName(record) {
    if (record.type === 'B') {
        return null;
    }
    if (record.name === null || record.name === undefined || record.name === '') {
        return record.type === 'C' ? '' : null;
    }
    return record.name;
}

function buildMeta(record) {
    const meta = {
        alwaysShow: !!record.alwaysShow,
        hidden: record.visible === 0 || !!record.hidden,
        icon: record.icon || '',
        params: parseParams(record.params),
        title: record.title
    };
    if (record.keepAlive !== null && record.keepAlive !== undefined) {
        meta.keepAlive = !!record.keepAlive;
    }
    return meta;
}

function toRouteNode(record, children = []) {
    const routeName = getRouteName(record);
    const routePath = record.path || '';
    const node = {
        meta: buildMeta(record),
        name: routeName !== null && routeName !== '' ? routeName : routePath,
        path: routePath
    };
    if (record.component) {
        node.component = record.component;
    }
    if (record.redirect) {
        node.redirect = record.redirect;
    }
    if (children.length) {
        node.children = children;
    }
    return node;
}

function toManageNode(record, children = []) {
    const routeName = getRouteName(record);
    return {
        children,
        component: record.component || null,
        icon: record.icon || '',
        id: String(record.id),
        name: record.title,
        parentId: record.parentId ? String(record.parentId) : '0',
        perm: record.perm || null,
        redirect: record.redirect || null,
        routeName: routeName === '' ? '' : routeName,
        routePath: record.path || '',
        scope: record.scope ?? 1,
        sort: record.sort ?? 0,
        type: record.type || 'M',
        visible: record.visible !== undefined && record.visible !== null ? record.visible : record.hidden ? 0 : 1
    };
}

function buildTree(flatList, toNode) {
    const sorted = [...flatList].sort((a, b) => {
        const ra = normalizeRecord(a);
        const rb = normalizeRecord(b);
        return ra.sort - rb.sort || ra.id - rb.id;
    });
    const map = new Map();

    sorted.forEach((item) => {
        const record = normalizeRecord(item);
        map.set(record.id, { record, children: [] });
    });

    const roots = [];
    map.forEach((entry) => {
        const { record } = entry;
        if (record.parentId) {
            const parent = map.get(record.parentId);
            if (parent) {
                parent.children.push(entry);
            }
        } else {
            roots.push(entry);
        }
    });

    roots.sort((a, b) => a.record.sort - b.record.sort || a.record.id - b.record.id);
    map.forEach((entry) => {
        entry.children.sort((a, b) => a.record.sort - b.record.sort || a.record.id - b.record.id);
    });

    function buildNodes(entries) {
        return entries.map(({ record, children }) => {
            const childNodes = children.length ? buildNodes(children) : [];
            return toNode(record, childNodes);
        });
    }

    return buildNodes(roots);
}

module.exports.buildMenuTree = function (flatList) {
    return buildTree(flatList, toRouteNode);
};

module.exports.buildMenuManageTree = function (flatList) {
    return buildTree(flatList, toManageNode);
};

function toOptionNode(record, children = []) {
    const node = {
        label: record.title,
        value: String(record.id)
    };
    if (children.length) {
        node.children = children;
    }
    return node;
}

module.exports.buildMenuOptionsTree = function (flatList, onlyParent = true) {
    const list = onlyParent
        ? flatList.filter((item) => {
              const record = normalizeRecord(item);
              return record.type !== 'B';
          })
        : flatList;
    return buildTree(list, toOptionNode);
};

module.exports.toManageDetail = function (record) {
    const node = toManageNode(record, []);
    delete node.children;
    return {
        ...node,
        alwaysShow: !!record.alwaysShow,
        hidden: !!record.hidden,
        keepAlive: record.keepAlive === null || record.keepAlive === undefined ? null : !!record.keepAlive,
        params: parseParams(record.params)
    };
};

module.exports.toMenuRecord = function (body) {
    const parentId =
        body.parentId === '0' || body.parentId === 0 || body.parentId === null || body.parentId === undefined || body.parentId === ''
            ? null
            : Number(body.parentId);

    const type = body.type || 'M';
    const isButton = type === 'B';
    const isCatalog = type === 'C';
    const displayName = body.title || body.name || '';

    let routeName = '';
    let routePath = '';

    if (isButton) {
        routeName = '';
        routePath = '';
    } else if (isCatalog) {
        routeName = body.routeName !== undefined ? body.routeName : '';
        routePath = body.routePath ?? body.path ?? '';
    } else {
        routeName = body.routeName ?? body.name ?? '';
        routePath = body.routePath ?? body.path ?? '';
    }

    const visible =
        body.visible !== undefined && body.visible !== null
            ? Number(body.visible)
            : body.hidden
              ? 0
              : 1;

    return {
        parentId,
        title: displayName,
        name: isButton ? '' : String(routeName ?? ''),
        path: isButton ? '' : String(routePath ?? ''),
        component: isButton ? null : isCatalog ? body.component || 'Layout' : body.component || null,
        redirect: body.redirect || null,
        icon: body.icon || '',
        hidden: visible === 0,
        alwaysShow: !!body.alwaysShow,
        keepAlive: body.keepAlive === undefined || body.keepAlive === null ? null : !!body.keepAlive,
        params:
            body.params === null || body.params === undefined
                ? null
                : typeof body.params === 'string'
                  ? body.params
                  : JSON.stringify(body.params),
        sort: body.sort === undefined || body.sort === null ? 0 : Number(body.sort),
        perm: body.perm || null,
        type,
        scope: body.scope !== undefined && body.scope !== null ? Number(body.scope) : 1,
        visible
    };
};

module.exports.parseParams = parseParams;
