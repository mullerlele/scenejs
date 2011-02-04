SceneJS._namespace("SceneJS.objects");

/**
 * @class A scene node that defines a disk geometry.
 * <p>The geometry is complete with normals for shading and one layer of UV coordinates for
 * texture-mapping. It can also be configured as solid (default), to construct it from 
 * triangles with normals for shading and one layer of UV coordinates for texture-mapping
 * When not solid, it will be a wireframe drawn as line segments.</p>
 * <p><b>Example Usage</b></p><p>Definition of solid disk that extends 6 units radially from the Y-axis,
 * is 2 units high in the Y-axis and is made up of 48 longitudinal rings:</b></p><pre><code>
 * var c = new SceneJS.Disk({
 *          radius: 6,       // Optional radius (1 is default)
 *          inner_radius: 3  // Optional inner_radius results in ring (default is 0)
 *          height: 2,       // Optional height (1 is default)
 *          rings: 48        // Optional number of longitudinal rings (30 is default)
 *     })
 * </pre></code>
 * @extends SceneJS.Geometry
 * @since Version 0.7.9
 * @constructor
 * Create a new SceneJS.Disk
 * @param {Object} [cfg] Static configuration object
 * @param {float} [cfg.radius=1.0] radius extending from Y-axis
 * @param {float} [cfg.inner_radius=0] inner radius extending from Y-axis
 * @param {float} [cfg.height=1.0] height on Y-axis
 * @param {float} [cfg.rings=30]  number of longitudinal rings
 * @param {...SceneJS.Node} [childNodes] Child nodes
 */
SceneJS.Disk = SceneJS.createNodeType("disk", "geometry");

// @private
SceneJS.Disk.prototype._init = function(params) {
    this._attr.nodeType = "disk";

    var radius = params.radius || 1;
    var height = params.height || 1;
    var rings =  params.rings || 30;
    var inner_radius = params.inner_radius || 0;
    if (inner_radius > radius) {
        inner_radius = radius
    }

    /* Resource ID ensures that we reuse any sphere that has already been created with
     * these parameters instead of wasting memory
     */
    this._resource = "disk_" + radius + "_" + height + "_" + rings + "_" + inner_radius;

    /* Callback that does the creation in case we can't find matching disk to reuse     
     */
     this._create = function() {
         var positions = [];
         var normals = [];
         var uv = [];

         var ybot = height * -0.5;
         var ytop = height *  0.5;

         for (var ringNum = 0; ringNum <= rings; ringNum++) {
             var phi = ringNum * 2 * Math.PI / rings;
             var sinPhi = Math.sin(phi);
             var cosPhi = Math.cos(phi);

             var x = cosPhi;
             var z = sinPhi;
             var u = 1 - (ringNum / rings);
             var v = 0.5;

             normals.push(-x);
             normals.push(-ybot);
             normals.push(-z);
             uv.push(u);
             uv.push(v);
             positions.push(radius * x);
             positions.push(ybot);
             positions.push(radius * z);

             normals.push(-x);
             normals.push(-ytop);
             normals.push(-z);
             uv.push(u);
             uv.push(v);
             positions.push(radius * x);
             positions.push(ytop);
             positions.push(radius * z);
             
             if (inner_radius > 0) {
            
                 normals.push(-x);
                 normals.push(-ytop);
                 normals.push(-z);
                 uv.push(u);
                 uv.push(v);
                 positions.push(inner_radius * x);
                 positions.push(ytop);
                 positions.push(inner_radius * z);
                 
                 normals.push(-x);
                 normals.push(-ybot);
                 normals.push(-z);
                 uv.push(u);
                 uv.push(v);
                 positions.push(inner_radius * x);
                 positions.push(ybot);
                 positions.push(inner_radius * z);
            }              
                
         }
         
         var indices = [];
         
         if (inner_radius > 0) {
             
             for (var ringNum = 0; ringNum < rings; ringNum++) {
                 var index = ringNum * 4;

                 indices.push(index + 0);
                 indices.push(index + 1);
                 indices.push(index + 4);

                 indices.push(index + 1);
                 indices.push(index + 4);
                 indices.push(index + 5);

                 indices.push(index + 1);
                 indices.push(index + 2);
                 indices.push(index + 5);

                 indices.push(index + 2);
                 indices.push(index + 5);
                 indices.push(index + 6);

                 indices.push(index + 2);
                 indices.push(index + 3);
                 indices.push(index + 6);

                 indices.push(index + 3);
                 indices.push(index + 6);
                 indices.push(index + 7);

                 indices.push(index + 3);
                 indices.push(index + 0);
                 indices.push(index + 7);

                 indices.push(index + 0);
                 indices.push(index + 7);
                 indices.push(index + 4);
             }
                 
         } else {

             var centerBot = rings * 2 + 2;

             normals.push(0, -1.0, 0);
             uv.push(1, 0.5);
             positions.push(0, ybot, 0);

             var centerTop = rings * 2 + 3;

             normals.push(0, 1.0, 0);
             uv.push(1, 0.5);
             positions.push(0, ytop, 0);
             
             for (var ringNum = 0; ringNum < rings; ringNum++) {
                 var index = ringNum * 2;
                 indices.push(index);
                 indices.push(index + 1);
                 indices.push(index + 2);

                 indices.push(index + 1);
                 indices.push(index + 2);
                 indices.push(index + 3);
             }

             for (var ringNum = 0; ringNum < rings; ringNum++) {
                 var index = ringNum * 2;
                 indices.push(index);
                 indices.push(index + 2);
                 indices.push(centerBot);

                 indices.push(index + 1);
                 indices.push(index + 3);
                 indices.push(centerTop);
             }
             
         }


         return {
             primitive : "triangles",
             positions : positions,
             normals: normals,
             uv : uv,
             indices : indices
         };
    };
};
