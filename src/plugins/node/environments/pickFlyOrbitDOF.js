SceneJS.Types.addType("environments/pickFlyOrbitDOF", {

    construct: function (params) {

        var cameraId = this.getId() + ".camera";
        var effectId = this.getId() + ".effect";

        this.addNode({
            type: "cameras/pickFlyOrbit",
            id: cameraId,
            yaw: -40,
            pitch: -20,
            maxPitch: -10,
            minPitch: -80,
            zoom: 800,
            eye: { x: 0, y: 150, z: -1000 },
            look: { x: 0, y: 150, z: 0 },
            zoomSensitivity: 20.0,
            showPick: true,

            nodes: [
                {
                    type: "postprocess/dof",
                    id: effectId,
                    texelSize: 0.00022,
                    blurCoeff: 0.0084,
                    focusDist: 500.0,
                    ppm: 10000,
                    near: 0.1,
                    far: 10000.0,

                    nodes: params.nodes
                }
            ]
        });

        // Synch focusDist with length of eye->look vector
        var scene = this.getScene();
        scene.getNode(cameraId, function (camera) {
            scene.getNode(effectId, function (effect) {
                camera.on("updated", function (lookat) {
                    effect.setFocusDist(
                        SceneJS_math_lenVec3([
                            lookat.look.x - lookat.eye.x,
                            lookat.look.y - lookat.eye.y,
                            lookat.look.z - lookat.eye.z
                        ]));
                });
            });
        });
    }
});