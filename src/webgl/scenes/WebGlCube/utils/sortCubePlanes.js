import {vec3} from "gl-matrix";

export default (planes, matrices) => {
    const v1 = vec3.fromValues(matrices.view[12], matrices.view[13], matrices.view[14]);
    return [...planes].sort((planeA, planeB) => {
        const vc1 = vec3.fromValues(...planeA.position);
        const vc2 = vec3.fromValues(...planeB.position);
        vec3.transformMat4(vc1, vc1, matrices.model);
        vec3.transformMat4(vc2, vc2, matrices.model);
        const dist1 = vec3.distance(v1, vc1);
        const dist2 = vec3.distance(v1, vc2);
        if (dist1 > dist2) {
            return -1;
        }
        if (dist1 < dist2) {
            return 1;
        }
        return 0
    })
}
