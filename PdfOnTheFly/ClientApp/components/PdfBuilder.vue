<template>
    <div class="container">
        <div class="row mt-3">
            <div class="col-6">
                <div ref="canvasEl" class="w-100" :style="{'background-image': `url('${backgroundUrl}')`}" id="canvas" style="background-size: 100% 100%; height: 800px; position: relative; overflow: hidden; box-shadow: 0 0 0 2px #2b3a65 !important">
                    <div :data-x="0" :data-y="0" :ref="obj.refId" class="no-touch" :class="{ draggable: obj.type == 'text', 'resize-drag': obj.type == 'image' }" v-for="obj in objects" :key="obj.id"
                            :style="{left: `${obj.x}px`, top: `${obj.y}px`, width: obj.w ? `${obj.w}px` : null, height: obj.h ? `${obj.h}px` : null}"
                            style="position: absolute;">
                        <div class="w-100 h-100 d-flex align-items-center" :style="{color: obj.color, 'font-size': `${obj.fontSize}px`, 'line-height': `${obj.fontSize}px`}" v-if="obj.type == 'text'">{{obj.value}}</div>
                        <div v-if="obj.type == 'image' && !!obj.value" class="w-100 h-100">
                            <img class="w-100 h-100" :src="obj.value" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div v-for="obj in objects" :key="obj.id">
                    <div class="form-row">
                        <div v-if="obj.type == 'text'" class="form-group col-8" :class="{'col-9': obj.type == 'text'}">
                            <label>{{obj.label}}</label>
                            <input class="form-control" v-model="obj.value" />
                        </div>
                        <div class="col-3" v-if="obj.type == 'text'">
                            <label>Text color</label>
                            <select class="form-control" v-model="obj.color">
                                <option v-for="c in availableColors" :value="c">{{c}}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div v-if="obj.type == 'image'" class="form-group">
                        <label>{{obj.label}} (put image URL here)</label>
                        <input class="form-control" v-model="obj.value" />
                    </div>
                </div>
                <div>
                    <button type="button" class="btn btn-primary" @click="generatePdf">Generate PDF</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import interact from 'interactjs'
    import axios from 'axios'
    import { PDFDocument, StandardFonts, rgb, CMYK } from 'pdf-lib'

    export default {
        data() {
            return {
                objects: [
                    {
                        type: 'text', x: 30, y: 30, id: 0, value: 'Text here', fontSize: 22, label: 'Text field 1', color: '#000000', refId: 'ref1'
                    },
                    {
                        type: 'text', x: 350, y: 130, id: 1, value: 'Another text', fontSize: 22, label: 'Text field 2', color: '#aaaaff', refId: 'ref2'
                    },
                    {
                        type: 'image', x: 80, y: 330, w: 200, h: 133, id: 2, refId: 'ref3', value: 'https://images.unsplash.com/photo-1558981033-0f0309284409?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', label: 'Text field 1'
                    }
                ],
                backgroundUrl: 'https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1017-15490.jpg?size=626&ext=jpg',
                availableColors: ['#000000', '#aaaaff', '#CC0000', '#006E2E']
            }
        },
        methods: {
            makeDraggable(interactObj) {
                return interactObj.draggable({
                    //modifiers: [
                    //    interact.modifiers.restrictRect({
                    //        restriction: 'parent',
                    //        endOnly: true
                    //    })
                    //],
                    onmove(event) {
                        var target = event.target
                        // keep the dragged position in the data-x/data-y attributes
                        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                        //console.log(event.pageX, event.pageY, event, x, y);

                        // translate the element
                        target.style.webkitTransform =
                            target.style.transform =
                            'translate(' + x + 'px, ' + y + 'px)'

                        // update the posiion attributes
                        target.setAttribute('data-x', x)
                        target.setAttribute('data-y', y)
                    }
                });
            },
            makeResizable(interactObj) {
                return interactObj.resizable({
                    // resize from all edges and corners
                    edges: { right: true, bottom: true },

                    modifiers: [
                        // keep the edges inside the parent
                        interact.modifiers.restrictEdges({
                            outer: 'parent',
                            endOnly: true
                        }),

                        // minimum size
                        interact.modifiers.restrictSize({
                            min: { width: 100, height: 50 }
                        })
                    ],
                }).on('resizemove', function (event) {
                    var target = event.target

                    // update the element's style
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'
                });
            },
            generatePdf() {
                var vm = this;
                var objects = this.objects.map(obj => {
                    var ref = vm.$refs[obj.refId];
                    var clone = JSON.parse(JSON.stringify(obj));

                    clone.x = obj.x + parseFloat(ref[0].attributes.getNamedItem('data-x').value);
                    clone.y = obj.y + parseFloat(ref[0].attributes.getNamedItem('data-y').value);
                    clone.w = ref[0].clientWidth;
                    clone.h = ref[0].clientHeight;
                    var canvasEl = vm.$refs.canvasEl;
                    clone.yInverse = obj.type == 'text'
                        ? canvasEl.clientHeight - clone.y - clone.fontSize// - (clone.h ? clone.h : clone.fontSize);
                        : canvasEl.clientHeight - clone.y - clone.h;
                    //console.log(clone)
                    return clone;
                });
                //axios.post('/generate-pdf', objects);

                vm.drawPdf(objects);
            },
            drawPdf(objects) {
                var vm = this;
                this.getBytes(vm.backgroundUrl).then(bgBytes => {
                    console.log(bgBytes)
                    return PDFDocument.create().then(pdfDoc => {
                        Promise.all([
                            pdfDoc.embedJpg(bgBytes),
                            pdfDoc.embedFont(StandardFonts.Helvetica)
                        ]).then(results => {
                            var jpgImage = results[0];
                            var timesRomanFont = results[1];

                            const page = pdfDoc.addPage()
                            const { width, height } = page.getSize();

                            var canvasEl = vm.$refs.canvasEl;
                            var scale = {
                                x: width / canvasEl.clientWidth,
                                y: height / canvasEl.clientHeight
                            };
                            console.log(scale)

                            page.drawImage(jpgImage, {
                                x: 0,
                                y: 0,
                                width: width,
                                height: height,
                            });

                            var shift = 0;
                            var objPromises = objects.map(obj => {
                                if (obj.type == 'text') {
                                    // Draw a string of text toward the top of the page
                                    //const fontSize = 30
                                    var size = timesRomanFont.sizeAtHeight(obj.fontSize * scale.y);
                                    page.drawText(obj.value, {
                                        //x: 0,// obj.x * scale.x + obj.fontSize / 2,
                                        //y: shift,//obj.yInverse * scale.y + obj.fontSize / 2,
                                        x: obj.x * scale.x,
                                        y: obj.yInverse * scale.y,
                                        size: size,
                                        font: timesRomanFont,
                                        color: vm.hexToRgb(obj.color)
                                    });
                                    shift += obj.fontSize / scale.y;
                                    console.log(obj.fontSize, size)
                                    return Promise.resolve();
                                } else if (obj.type == 'image') {
                                    if (obj.value) {
                                        return vm.getBytes(obj.value).then(objImageBytes => {
                                            return pdfDoc.embedJpg(objImageBytes).then(objImage => {
                                                console.log(obj.value, objImage)
                                                page.drawImage(objImage, {
                                                    x: obj.x * scale.x,
                                                    y: obj.yInverse * scale.y,
                                                    width: obj.w * scale.x,
                                                    height: obj.h * scale.y,
                                                });
                                            });
                                        });
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            });

                            return Promise.all(objPromises).then(() => {
                                // Serialize the PDFDocument to bytes (a Uint8Array)
                                return pdfDoc.save().then(function (pdfBytes) {
                                    vm.downloadPdf('Card', pdfBytes);
                                })
                            })
                        });
                    });
                });
            },
            downloadPdf(reportName, byte) {
                var blob = new Blob([byte], { type: "application/pdf" });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                var fileName = reportName;
                link.download = fileName;
                link.click();
            },
            getBytes(url) {
                return axios.get(url, {
                    responseType: 'arraybuffer',
                    crossdomain: true
                }).then(response => response.data);
                    //.then(response => Buffer.from(response.data, 'binary').toString('base64'))
            },
            hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                console.log(result)
                return result ? rgb(parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255) : null;
            }
        },
        mounted() {
            this.makeDraggable(interact('.draggable'));
            this.makeResizable(this.makeDraggable(interact('.resize-drag')));
        }
    }
</script>

<style lang="scss">
    .no-touch {
        touch-action: none
    }
</style>
