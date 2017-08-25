var fs = require('fs');

const imagesJSONPath = "./data/images.json";
const labelsJSONPath = "./data/labels.json";

const IMAGES_KEY = Symbol("IMAGES");

function tolower(str) { 
    if (str) {
        return str.toLowerCase();
    }
    return null;
}

class Image {
    constructor(srcOrData) {
        if (typeof srcOrData === "string") {
            this.src = srcOrData || "";
            this.labels = [];
        } else {
            Object.assign(this, srcOrData);
        }
    }

    label(label) {
        if (this.labels.length == 0) {
            this.labels = [label];
            return true;
        }

        let idx = this.labels.indexOf(label);
        if (idx === -1) {
            this.labels.push(label);
            return true;
        }

        return false;
    }

    unlabel(labels) {
        if (labels instanceof String)
            labels = [ labels ];
        labels.forEach( (label) => {
            let idx = this.labels.indexOf(from);
            if (idx >= 0) {
                this.labels.splice(idx, 1);
                return true;
            }
        }, this);

        return false;
    }

    is(label) {
        return this.labels.indexOf(label) >= 0;
    }

    some(labels) {
        this.labels.some( (label) => {
            return -1 != labels.indexOf(label);
        })
    }
}

class Images {
    constructor() {
        if (global[IMAGES_KEY]) {
            throw ("Images is singleton!");
        }
        global[IMAGES_KEY] = this;
        this.images = [];
        this.labels = [];
    }

    load() {
        this.images = (JSON.parse(fs.readFileSync(imagesJSONPath, 'utf8')) || []).map( (image) => new Image(image) );
        this.labels = JSON.parse(fs.readFileSync(labelsJSONPath, 'utf8')) || [];
        return this;
    }

    save() {
        fs.writeFileSync(imagesJSONPath, JSON.stringify(this.images), { encoding: 'utf8'});
        fs.writeFileSync(labelsJSONPath, JSON.stringify(this.labels), { encoding: 'utf8'});
        return this;
    }

    fix() {
        this.images.forEach( (image) => image.labels = image.labels.map( tolower ) );
        this.labels = this.labels.filter( (x) => x ).map( tolower );
        this.save();
        return this.labels;
    }

    diff(labels) {
        return labels.filter( (label) => this.labels.indexOf(label) == -1, this);
    }

    renameLabels(from, to) {
        let images = this.images.select(from);
        let renameFunction;
        
        images.forEach( (image) => image.unlabel(from) && image.label(to));
    }

    removeLabels(labels, images) {
        if (!(labels instanceof Array))
            labels = [ labels ];

        labels.forEach((label) => {
            let idx = this.labels.indexOf(from);
            if (idx >= 0) {
                this.labels.splice(idx, 1);
            }
        })
        if (!images) images = this.images;
        //hell
        labels.forEach( (label) => images.forEach( (image) => image.unlabel(labels)) );
    }

    newLabel(label) {
        if (this.labels.includes(label)) {
            return false;
        }

        this.labels.push(label);
        return true;
    }

    findOrCreateImage(src) {
        let found = this.findImage(src);
        if (found) {
            return found;
        }
        else {
            var img = new Image(src);
            this.images.push(img);
            return img; 
        }
    }

    findImage(src) {
        let found = this.images.find((image) => image.src === src);
        if (found) {
            return found;
        }

        return false;
    }

    preLabeled(label) {
        this.newLabel(label);
        var thiz = this;
        return (src) => {
            thiz.findOrCreateImage(src).label(label);
        }
    }

    select(labelOrLabels) {
        let checkFunction;
        if (labelOrLabels instanceof Array) {
            checkFunction = (image) => image.some(labelOrLabels);
        } else {
            checkFunction = (image) => image.is(labelOrLabels);
        }

        return this.images.filter((image) => checkFunction(image));
    }
}

Object.defineProperty(Images, "instance", {
  get: function(){
      return global[IMAGES_KEY] || (global[IMAGES_KEY] = new Images()).load(); 
  }
});

Object.freeze(Images);

module.exports = { Images: Images, Image: Image };