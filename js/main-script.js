// Tarefa 9 - trabalho disponível na página pessoal web do técnico da Sofia Pinho nº199272
// https://web.tecnico.ulisboa.pt/ist199272/Trabalho%20C/

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var currentCamera, scene, texScene, renderer;

var texture1, texture2, newTexture;

var terrain, skyDome, moon, house, ufo;

var trees = [];

var moonMaterial = [], treeBarkMaterial = [], treeLeavesMaterial = [], wallMaterial = [], roofMaterial = []
var windowMaterial = [], ufoBodyMaterial = [], ufoCockpitMaterial = [], ufoLightMaterial = [], ufoCylinderMaterial = [];

var texCamera, texSquare1, texSquare2;

var texSquare1, texSquare2;

var ambientlight, directionalLight, spotLight, pointLights = [];

var keyMap = []

var currentScene, currentTexture = 0;

var noLights = false;

const clock = new THREE.Clock();

var delta, speed = 300, angle = Math.PI;

var cameraGroup;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScenes() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color(0xAAAAAA);
    

    createLights();
    scene.add(ambientlight);
    
    createTerrain();
    createSkyDome();
    createMoon(-395, 700, 395);

    moon.add(directionalLight);
    createHouse(-600, 140, -50);
    createUFO(0, 450, 0);

    trees[0] = createCorkTree(1);
    trees[0].applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI / 20));
    trees[0].applyMatrix4(new THREE.Matrix4().makeTranslation(500, 160, 0));

    trees[1] = createCorkTree(0);
    trees[1].applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 4));
    trees[1].applyMatrix4(new THREE.Matrix4().makeTranslation(-350, 130, -150));

    trees[2] = createCorkTree(0.5);
    trees[2].applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI / 3));
    trees[2].applyMatrix4(new THREE.Matrix4().makeTranslation(-200, 175, 600));

    trees[3] = createCorkTree(1);
    trees[3].applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    trees[3].applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 20));
    trees[3].applyMatrix4(new THREE.Matrix4().makeTranslation(500, 160, 500));

    trees[4] = createCorkTree(0);
    trees[4].applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 5));
    trees[4].applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 20));
    trees[4].applyMatrix4(new THREE.Matrix4().makeTranslation(-600, 180, 500));

    trees[5] = createCorkTree(1.5);
    trees[5].applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 6));
    trees[5].applyMatrix4(new THREE.Matrix4().makeTranslation(100, 180, -400));

    texScene = new THREE.Scene();
    texScene.add(new THREE.AxesHelper(10));
    texScene.background = new THREE.Color(0xAAAAAA);
    
    createTextureSquares();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';

    currentCamera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         5000);
    currentCamera.position.x = 0;
    currentCamera.position.y = 400;
    currentCamera.position.z = -950;
    currentCamera.lookAt(ufo.position);
}

function cameraVrAdjustments() {
    cameraGroup = new THREE.Group();
    cameraGroup.add(currentCamera);
    // set cameragroup position equal to currentcamera position
    cameraGroup.position.set(currentCamera.position.x, currentCamera.position.y, currentCamera.position.z);
    cameraGroup.lookAt(scene.position);

    // rotate group by 180 degrees so its not backwards
    cameraGroup.rotateY(Math.PI);
    scene.add(cameraGroup);
}

function removeVrAdjustments() {
    cameraGroup.rotateY(-Math.PI);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';
    ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(0, 1, -10);
    directionalLight.castShadow = true;
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createTextureSquares() {
    'use strict';

    var geometry = new THREE.PlaneGeometry(100, 100);
    texSquare1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
    texSquare2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffffff}));

    texSquare1.position.set(-55, 0, 0);
    texSquare2.position.set(55, 0, 0);
    texScene.add(texSquare1);
    texScene.add(texSquare2);
}

function createTerrain() {
    'use strict';

    var heightmap = new THREE.TextureLoader().load('./images/heightmap.png');
    var geometry = new THREE.PlaneGeometry(2000, 2000, 128, 128);
    geometry.rotateX(-Math.PI / 2);
    changeTexture(1);
    texture1 = newTexture;
    var material = new THREE.MeshPhongMaterial({ map: texture1, displacementMap: heightmap, displacementScale: 600});
    terrain = new THREE.Mesh(geometry, material);
    terrain.position.y = -250;
    scene.add(terrain);
}

function createSkyDome() {
    'use strict';

    var geometry = new THREE.SphereGeometry(1000, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    changeTexture(2);
    texture2 = newTexture;
    var material = new THREE.MeshPhongMaterial({map: texture2, 
            side: THREE.BackSide, 
            emissive: 0xffffff,
            emissiveIntensity: 0.3,
            emissiveMap: texture2});
    skyDome = new THREE.Mesh(geometry, material);
    scene.add(skyDome);
}

function addTreeCrown(x, y, z, size) {
    'use strict';
    treeLeavesMaterial[0] = new THREE.MeshLambertMaterial({ color: 0x0f380f});
    treeLeavesMaterial[1] = new THREE.MeshPhongMaterial({ color: 0x0f380f});
    treeLeavesMaterial[2] = new THREE.MeshToonMaterial({ color: 0x0f380f});
    treeLeavesMaterial[3] = new THREE.MeshBasicMaterial({ color: 0x0f380f});
    var geometry = new THREE.SphereGeometry(size, 32, 32);
    geometry.scale(1, 1/3, 1)
    var treeCrown = new THREE.Mesh(geometry, treeLeavesMaterial[0]);
    treeCrown.position.set(x, y, z);
    return treeCrown;
}

function addTreeTrunk(x, y, z, height, radius) {
    'use strict';
    treeBarkMaterial[0] = new THREE.MeshLambertMaterial({ color: 0xcf532d});
    treeBarkMaterial[1] = new THREE.MeshPhongMaterial({ color: 0xcf532d});
    treeBarkMaterial[2] = new THREE.MeshToonMaterial({ color: 0xcf532d});
    treeBarkMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xcf532d});
    var geometry = new THREE.CylinderGeometry(radius, radius, height, 16);    
    var treeTrunk = new THREE.Mesh(geometry, treeBarkMaterial[0]);
    treeTrunk.position.set(x, y, z);
    return treeTrunk;
}

function createCorkTree(added_height) {
    'use strict';
    var tree = new THREE.Object3D();
    var treetrunk1 = addTreeTrunk(0, 0, 0, 12+added_height, 1.2);
    treetrunk1.applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI / 6));
    var treetrunk2 = addTreeTrunk(-2.5, 3, 0, 9+added_height, 1);
    treetrunk2.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 6));
    var treeCrown1 = addTreeCrown(-6.5, 5+added_height, 0, 4);
    var treeCrown2 = addTreeCrown(3.5, 5+added_height, 0, 4);
    var treeCrown3 = addTreeCrown(-1.5, 7+added_height, 0, 4.5);
    //treeCrown1.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 4));
    tree.add(treetrunk1);
    tree.add(treetrunk2);
    tree.add(treeCrown1);
    tree.add(treeCrown2);
    tree.add(treeCrown3);
    scene.add(tree);

    tree.applyMatrix4(new THREE.Matrix4().makeScale(10, 10, 10));

    return tree;
}

function createMoon(x, y ,z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(100, 32, 32);
    moonMaterial[0] = new THREE.MeshLambertMaterial({ emissive: 0xdddd80, emissiveIntensity: 0.5});
    moonMaterial[1] = new THREE.MeshPhongMaterial({ emissive: 0xdddd80, emissiveIntensity: 0.5});
    moonMaterial[2] = new THREE.MeshToonMaterial({ emissive: 0xdddd80, emissiveIntensity: 0.5});
    moonMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xdddd80});
    moon = new THREE.Mesh(geometry, moonMaterial[0]);
    moon.position.set(x, y, z);
    scene.add(moon);
}

function createHouse(x, y, z) {
    'use strict';
    
    var vertices = new Float32Array([
        0, 0, 0, //0
        0, 4, 0, //1
        1, 0, 0, //2
        1, 1, 0, //3
        1, 3, 0, //4
        1, 4, 0, //5
        3, 0, 0, //6
        3, 1, 0, //7
        3, 3, 0, //8
        3, 4, 0, //9
        5, 0, 0, //10
        5, 4, 0, //11

        0, 0, -14, //12
        0, 4, -14, //13
        1, 0, -14, //14
        1, 1, -14, //15
        1, 3, -14, //16
        1, 4, -14, //17
        3, 0, -14, //18
        3, 1, -14, //19
        3, 3, -14, //20
        3, 4, -14, //21
        5, 0, -14, //22
        5, 4, -14, //23

        5, 0, -1, //24
        5, 1, -1, //25
        5, 3, -1, //26
        5, 4, -1, //27
        5, 0, -3, //28
        5, 1, -3, //29
        5, 3, -3, //30
        5, 4, -3, //31
        5, 0, -4, //32
        5, 3, -4, //33
        5, 4, -4, //34
        5, 0, -6, //35
        5, 3, -6, //36
        5, 4, -6, //37
        5, 0, -8, //38
        5, 1, -8, //39
        5, 3, -8, //40
        5, 4, -8, //41
        5, 0, -10, //42
        5, 1, -10, //43
        5, 3, -10, //44
        5, 4, -10, //45
        5, 0, -11, //46
        5, 1, -11, //47
        5, 3, -11, //48
        5, 4, -11, //49
        5, 0, -13, //50
        5, 1, -13, //51
        5, 3, -13, //52
        5, 4, -13, //53

        2.5, 6, 0, //54
        2.5, 6, -14, //55

    ]);

    var wallFaces = new Uint16Array([
        2, 1, 0,     //left
        1, 2, 5,
        6, 3, 2,
        3, 6, 7,
        8, 5, 4,
        5, 8, 9,
        10, 9, 6,
        9, 10, 11,
        12, 13, 14,  //right
        17, 14, 13,
        14, 15, 18,
        19, 18, 15,
        16, 17, 20,
        21, 20, 17,
        18, 21, 22,
        23, 22, 21,
        0, 1, 12,    //back
        13, 12, 1,
        24, 11, 10,  //front
        11, 24, 27,
        28, 25, 24,
        25, 28, 29,
        30, 27, 26,
        27, 30, 31,
        32, 31, 28,
        31, 32, 34,
        36, 34, 33,
        34, 36, 37,
        38, 37, 35,
        37, 38, 41,
        42, 39, 38,
        39, 42, 43,
        44, 41, 40,
        41, 44, 45,
        46, 45, 42,
        45, 46, 49,
        50, 47, 46,
        47, 50, 51,
        52, 49, 48,
        49, 52, 53,
        22, 53, 50,
        53, 22, 23
    ]);

    var roofFaces = new Uint16Array([
        1, 11, 54, //left
        55, 23, 13, //right
        1, 54, 13, //back
        55, 13, 54,
        23, 54, 11, //front
        55, 54, 23
    ]);

    var windowFaces = new Uint16Array([
        7, 4, 3, //left
        4, 7, 8,
        15, 16, 19, //right
        20, 19, 16,
        29, 26, 25, //front1
        26, 29, 30,
        43, 40, 39, //front2
        40, 43, 44,
        51, 48, 47, //front3
        48, 51, 52,
        35, 33, 32, //door
        33, 35, 36
    ]);

    var walls = new THREE.BufferGeometry();
    walls.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    walls.setIndex(new THREE.BufferAttribute(wallFaces, 1));
    walls.computeVertexNormals();
    var roof = new THREE.BufferGeometry();
    roof.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    roof.setIndex(new THREE.BufferAttribute(roofFaces, 1));
    roof.computeVertexNormals();
    var windows = new THREE.BufferGeometry();
    windows.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    windows.setIndex(new THREE.BufferAttribute(windowFaces, 1));
    windows.computeVertexNormals();

    house = new THREE.Object3D();
    wallMaterial[0] = new THREE.MeshLambertMaterial({ color: 0xffffff});
    wallMaterial[0].FlatShading = true;
    wallMaterial[1] = new THREE.MeshPhongMaterial({ color: 0xffffff});
    wallMaterial[1].FlatShading = true;
    wallMaterial[2] = new THREE.MeshToonMaterial({ color: 0xffffff});
    wallMaterial[2].FlatShading = true;
    wallMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xffffff});
    house.add(new THREE.Mesh(walls, wallMaterial[0]));
    roofMaterial[0] = new THREE.MeshLambertMaterial({ color: 0xed7d0c});
    roofMaterial[0].FlatShading = true;
    roofMaterial[1] = new THREE.MeshPhongMaterial({ color: 0xed7d0c});
    roofMaterial[1].FlatShading = true;
    roofMaterial[2] = new THREE.MeshToonMaterial({ color: 0xed7d0c});
    roofMaterial[2].FlatShading = true;
    roofMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xed7d0c});
    house.add(new THREE.Mesh(roof, roofMaterial[0]));
    windowMaterial[0] = new THREE.MeshLambertMaterial({ color: 0x6666ff});
    windowMaterial[0].FlatShading = true;
    windowMaterial[1] = new THREE.MeshPhongMaterial({ color: 0x6666ff});
    windowMaterial[1].FlatShading = true;
    windowMaterial[2] = new THREE.MeshToonMaterial({ color: 0x6666ff});
    windowMaterial[2].FlatShading = true;
    windowMaterial[3] = new THREE.MeshBasicMaterial({ color: 0x6666ff});
    house.add(new THREE.Mesh(windows, windowMaterial[0]));

    house.applyMatrix4(new THREE.Matrix4().makeScale(20, 20, 20));
    house.position.set(x, y, z);
    house.applyMatrix4(new THREE.Matrix4().makeRotationY((2/3)*Math.PI));
    scene.add(house);
}

function createUFO(x, y, z) {
    'use strict';

    ufo = new THREE.Object3D();
    var body = new THREE.SphereGeometry(7, 32, 32);
    body.applyMatrix4(new THREE.Matrix4().makeScale(1, 1/7, 1));
    var cockpit = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    
    ufoBodyMaterial[0] = new THREE.MeshLambertMaterial({ color: 0xaaaaaa});
    ufoBodyMaterial[0].FlatShading = true;
    ufoBodyMaterial[1] = new THREE.MeshPhongMaterial({ color: 0xaaaaaa});
    ufoBodyMaterial[1].FlatShading = true;
    ufoBodyMaterial[2] = new THREE.MeshToonMaterial({ color: 0xaaaaaa});
    ufoBodyMaterial[2].FlatShading = true;
    ufoBodyMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xaaaaaa});
    ufoCockpitMaterial[0] = new THREE.MeshLambertMaterial({ color: 0x6699ff});
    ufoCockpitMaterial[0].FlatShading = true;
    ufoCockpitMaterial[1] = new THREE.MeshPhongMaterial({ color: 0x6699ff});
    ufoCockpitMaterial[1].FlatShading = true;
    ufoCockpitMaterial[2] = new THREE.MeshToonMaterial({ color: 0x6699ff});
    ufoCockpitMaterial[2].FlatShading = true;
    ufoCockpitMaterial[3] = new THREE.MeshBasicMaterial({ color: 0x6699ff});
    ufo.add(new THREE.Mesh(body, ufoBodyMaterial[0]));
    ufo.add(new THREE.Mesh(cockpit, ufoCockpitMaterial[0]));

    var geometry = new THREE.CylinderGeometry(3, 3, 1.5, 32);
    ufoCylinderMaterial[0] = new THREE.MeshLambertMaterial({ color: 0xb30000});
    ufoCylinderMaterial[0].FlatShading = true;
    ufoCylinderMaterial[1] = new THREE.MeshPhongMaterial({ color: 0xb30000});
    ufoCylinderMaterial[1].FlatShading = true;
    ufoCylinderMaterial[2] = new THREE.MeshToonMaterial({ color: 0xb30000});
    ufoCylinderMaterial[2].FlatShading = true;
    ufoCylinderMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xb30000});
    var cylinder = new THREE.Mesh(geometry, ufoCylinderMaterial[0]);
    cylinder.position.set(0, -0.5, 0);
    ufo.add(cylinder);

    spotLight = new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI / 3, 0.5, 3);
    spotLight.castShadow = true;
    spotLight.diffuse = 1;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    cylinder.add(spotLight);

    let target = new THREE.Object3D();
    spotLight.target = target;
    target.position.set(0, -100, 0);
    cylinder.add(target);

    ufoLightMaterial[0] = new THREE.MeshLambertMaterial({ emissive: 0xffff66, emissiveIntensity: 0.5});
    ufoLightMaterial[1] = new THREE.MeshPhongMaterial({ emissive: 0xffff66, emissiveIntensity: 0.5});
    ufoLightMaterial[2] = new THREE.MeshToonMaterial({ emissive: 0xffff66, emissiveIntensity: 0.5});
    ufoLightMaterial[3] = new THREE.MeshBasicMaterial({ color: 0xffff66});
    for (var i = 0; i < 8; i++) {
        var sphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        var pointLight = new THREE.PointLight(0xffff66, 1, 100, 3);
        pointLight.position.set(0, 2, 0);
        pointLights[i] = pointLight;
        var sphereMesh = new THREE.Mesh(sphere, ufoLightMaterial[0]);
        sphereMesh.position.set(0, 0, 5);
        sphereMesh.add(pointLight);
        sphereMesh.applyMatrix4(new THREE.Matrix4().makeRotationY(i * Math.PI / 4));
        sphereMesh.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI));
        ufo.add(sphereMesh);
    }

    ufo.applyMatrix4(new THREE.Matrix4().makeScale(15, 15, 15));
    ufo.position.set(x, y, z);
    scene.add(ufo);
    
}


//////////////////
/* UFO MOVEMENT */
//////////////////

function UFORotation() {
    ufo.rotation.y += delta*angle;
}

function UFOMovement() {
    'use strict';
    var vector = new THREE.Vector3(0, 0, 0);
    var limit = 800;

    var ufopos = Math.sqrt(Math.pow(ufo.position.x, 2) + Math.pow(ufo.position.z, 2));

    if (keyMap[38]==true && keyMap[40]==true){
        return;
    }

    if (keyMap[37]==true && keyMap[39]==true){
        return;
    }
    
    if (keyMap[38]==true && ufopos < limit){ //up arrow 38
        vector.z = 1;
    }
    else if (keyMap[38]==true && ufopos >= limit && ufo.position.z<=-10){ //up arrow 38
        vector.z = 1;
    }

    if (keyMap[40]==true && ufopos < limit){ //down arrow 40
        vector.z = -1;
    }
    else if (keyMap[40]==true && ufopos >= limit && ufo.position.z>=0){ //down arrow 40
        vector.z = -1;
    }

    if (keyMap[37]==true && ufopos < limit){ //left arrow 37
        vector.x = 1;
    }
    else if (keyMap[37]==true && ufopos >= limit && ufo.position.x<=-10){ //left arrow 37
        vector.x = 1;
    }

    if (keyMap[39]==true && ufopos < limit){ //right arrow 39
        vector.x = -1;
    }
    else if(keyMap[39]==true && ufopos >= limit && ufo.position.x>=10){ //right arrow 39
        vector.x = -1;
    }

    vector.normalize();

    ufo.position.add(vector.multiplyScalar(speed*delta));
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

////////////
/* UPDATE */
////////////

function update(){
    'use strict';
    delta = clock.getDelta();

    UFORotation();
    UFOMovement();
}

/////////////
/* DISPLAY */
/////////////

function render() {
    'use strict';
    renderer.render(currentScene, currentCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // enable vr and add vr button
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));

    // create scenes and cameras
    createScenes();
    currentScene = scene;
    createCamera();

    // add event listeners
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    renderer.xr.addEventListener("sessionstart", cameraVrAdjustments);
    renderer.xr.addEventListener("sessionend", removeVrAdjustments);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function animate() {
    'use strict';

    update();
    render();
    renderer.setAnimationLoop(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        currentCamera.aspect = window.innerWidth / window.innerHeight;
        currentCamera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////

function onKeyDown(e) {
    'use strict';

    var keyCode = e.keyCode;
    keyMap[keyCode] = true;

    switch (keyCode) {
        //cameras
        case 49: //1
            changeTexture(1);
            texture1 = newTexture;
            var material = new THREE.MeshBasicMaterial({ map: texture1});
            texSquare1.material = material;
            terrain.material.map = texture1;
            break;
        case 50: //2
            changeTexture(2);
            texture2 = newTexture;
            var material = new THREE.MeshBasicMaterial({ map: texture2});
            texSquare2.material = material;
            skyDome.material.map = texture2;
            skyDome.material.emissiveMap = texture2;
            break;
        case 32: //space
            if (currentScene == scene) {
                currentScene = texScene;
            }
            else {
                currentScene = scene;
            }
            break;
        case 68: //d
            directionalLight.visible = !directionalLight.visible;
            break;
        case 80: //p
            for (var i = 0; i < pointLights.length; i++) {
                pointLights[i].visible = !pointLights[i].visible;
            }
            break;
        case 83: //s
            spotLight.visible = !spotLight.visible;
            break;
        case 81: //q
            currentTexture = 0;
            changeOtherTextures(0);
            break;
        case 87: //w
            currentTexture = 1;
            changeOtherTextures(1);
            break;
        case 69: //e
            currentTexture = 2;
            changeOtherTextures(2);
            break; 
        case 82: //r
            if (!noLights) changeOtherTextures(3);
            else changeOtherTextures(currentTexture);
            noLights = !noLights;
            break;   
    }
}

/////////////////////
/* KEY UP CALLBACK */
/////////////////////

function onKeyUp(e){
    'use strict';

    var keyCode = e.keyCode;
    keyMap[keyCode] = false;
}

/////////////////////
/* CHANGE TEXTURES */
/////////////////////

function changeOtherTextures(n) {
    'use strict';

    for (var i = 0; i < trees.length; i++) {
        for (var j = 0; j < trees[i].children.length; j++) {
            if (j < 2) {
                trees[i].children[j].material = treeBarkMaterial[n];
            }
            else {
                trees[i].children[j].material = treeLeavesMaterial[n];
            }
        }
    }
    for (var i = 3; i < ufo.children.length; i++) {
        ufo.children[i].material = ufoLightMaterial[n];
    }
    house.children[0].material = wallMaterial[n];
    house.children[1].material = roofMaterial[n];
    house.children[2].material = windowMaterial[n];
    ufo.children[0].material = ufoBodyMaterial[n];
    ufo.children[1].material = ufoCockpitMaterial[n];
    ufo.children[2].material = ufoCylinderMaterial[n];
    moon.material = moonMaterial[n];
}

///////////////////////
/* GENERATE TEXTURES */
///////////////////////
function changeTexture(n) {
    'use strict';

    var canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    var context = canvas.getContext('2d');

    if (n == 1) {
        context.fillStyle = '#00e600';
        context.fillRect(0, 0, canvas.width, canvas.height);
        var numCircles = 2000;
        var circleRadius = 0.8;
        var colors = ['#ffffff', '#ffff66', '#ff66ff', '#80dfff'];
    }
    else if (n == 2) {
        canvas.width = 2048;
        var grd = context.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, '#000066');
        grd.addColorStop(0.8, '#732673');
        context.fillStyle = grd;
        context.fillRect(0, 0, canvas.width, canvas.height);
        var numCircles = 200;
        var circleRadius = 2;
        var colors = ['#ffffff'];
    }

    for (let i = 0; i < numCircles; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        var color = colors[Math.floor(Math.random() * colors.length)];
      
        context.beginPath();
        context.arc(x, y, circleRadius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
    }

    newTexture = new THREE.Texture(canvas);
    newTexture.needsUpdate = true;
}
