class Util {
    async listToTree(list) {
        const map = [];
        const roots = [];
        let i;
        let node = {};
        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }
        for (let x = 0; x < list.length; x += 1) {
            node = list[x];
            if (node.criterion_id !== null) {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.criterion_id]].children.push(node);
            } else {
                roots.push(node);
            }
        }

        return roots;
    }
}
export default new Util();
