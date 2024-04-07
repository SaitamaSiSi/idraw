const data = {
  bgColor: "#ffffff",
  elements: [
    // {
    //   name: "rect-001",
    //   x: 5,
    //   y: 5,
    //   w: 100,
    //   h: 50,
    //   type: "rect",
    //   desc: {
    //     bgColor: "#ffeb3b",
    //     borderRadius: 2,
    //     borderWidth: 0,
    //     borderColor: "#ffc107",
    //   },
    // },
    // {
    //   name: "text-002",
    //   x: 40,
    //   y: 40,
    //   w: 100,
    //   h: 60,
    //   // angle: 30,
    //   type: "text",
    //   desc: {
    //     fontSize: 16,
    //     text: [0, 1, 2, 3, 4].map(i => `Hello Text ${i}`).join('\r\n'),
    //     // text: [0, 1, 2, 3, 4].map(i => `Hello Text ${i}`).join(''),
    //     fontWeight: 'bold',
    //     color: "#666666",
    //     borderRadius: 30,
    //     borderWidth: 2,
    //     borderColor: "#ff5722",
    //   },
    // },
    // {
    //   name: "image-003",
    //   x: 80,
    //   y: 80,
    //   w: 160,
    //   h: 80,
    //   type: "image",
    //   desc: {
    //     src: './images/computer.png',
    //   },
    // },
    // {
    //   name: "svg-004",
    //   x: 200 - 5,
    //   y: 150 - 50,
    //   w: 100,
    //   h: 100,
    //   type: "svg",
    //   desc: {
    //     svg: '<svg t="1622524892065" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9337" width="200" height="200"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="9338"></path></svg>',
    //   },
    // },

    {
      name: "html-001",
      x: 20,
      y: 40,
      w: 150,
      h: 100,
      type: "html",
      angle: 0,
      desc: {
        html: `
          <style>
          .btn-box {
            margin: 10px 0;
          }
          .btn {
            line-height: 1.5715;
            position: relative;
            display: inline-block;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
            background-image: none;
            border: 1px solid transparent;
            box-shadow: 0 2px #00000004;
            cursor: pointer;
            user-select: none;
            height: 32px;
            padding: 4px 15px;
            font-size: 14px;
            border-radius: 2px;
            color: #000000d9;
            background: #fff;
            border-color: #d9d9d9;
          }
          .btn-primary {
            color: #fff;
            background: #1890ff;
            border-color: #1890ff;
            text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
            box-shadow: 0 2px #0000000b;
          }
          </style>
          <div>
            <div class="btn-box">
              <button class="btn">
                <span> Hello &nbsp; Button</span>
              </button>
            </div>
            <div class="btn-box">
              <button class="btn btn-primary">
                <span>Button Primary</span>
              </button> 
            </div>
          </div>
        `,
      },
    },
  ],
};

export function getData() {
  return data;
}
