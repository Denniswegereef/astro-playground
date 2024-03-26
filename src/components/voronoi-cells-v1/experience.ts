import * as d3 from "d3"
import gsap from "gsap"
import { parsePath, roundCommands, roundCorners } from "svg-round-corners"

import { smoothPath } from "svg-smoother"

class Experience {
  container: HTMLElement | null
  height: number
  width: number
  svg: any

  data: [number, number][]
  originalData: [number, number][]
  mousePointActive: boolean = false

  constructor() {
    this.container = document.getElementById("container")
    this.width = 500
    this.height = 500

    this.data = this.generateDataPoints() as any
    // Clone the original data to use as a reference for the animation
    this.originalData = this.data.map((d) => [...d]) as [number, number][]

    this.init()
  }

  private init() {
    this.svg = d3
      .create("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("style", "max-width: 100%; height: auto;")
      .on("mousemove", (event) => {
        const [x, y] = d3.pointer(event)
        this.updateMousePoint(x, y)
      })

    this.svg = d3
      .create("svg")
      .attr("width", 0) // Hide the SVG by setting width and height to 0
      .attr("height", 0)

    // Initialize clipPath within defs
    const defs = this.svg.append("defs")

    const clipPath = defs.append("clipPath").attr("id", "myClip")

    if (this.container) this.container.appendChild(this.svg.node())

    this.updateVoronoi()

    if (this.container) this.container.appendChild(this.svg.node()!)

    // this.#startAnimation()
  }

  updateMousePoint(x: number, y: number) {
    if (!this.mousePointActive) {
      this.mousePointActive = true
      this.data.push([x, y])
    } else {
      this.data[this.data.length - 1] = [x, y]
    }
    this.updateVoronoi()
  }

  removeMousePoint() {
    if (this.mousePointActive) {
      this.data.pop()
      this.mousePointActive = false
      this.updateVoronoi()
    }
  }

  updateVoronoi() {
    const delaunay = d3.Delaunay.from(this.data)
    const voronoi = delaunay.voronoi([0, 0, this.width, this.height])

    this.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "rounded-cell")
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("rx", 20) // Adjust the rx and ry for roundedness
      .attr("ry", 20)

    this.svg
      .selectAll(".voronoi-cell")
      .data(this.data)
      .join("path")
      // .attr("d", arc.cornerRadius(10))
      .attr("class", "voronoi-cell")
      .attr("stroke", "blue")
      .attr("stroke-width", 10)
      // .attr("stroke-width", "1.5px")
      .attr("stroke-linejoin", "round")
      .attr("d", (_: any, i: number) => voronoi.renderCell(i))

      .attr("fill", "black")

    this.svg
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("transform", (d: any) => `translate(${d})`)
      .attr("r", 2)
      .attr("fill", "orange")
  }

  #startAnimation() {
    this.data.forEach((point, index) => {
      // Store the initial positions
      const pointObj = {
        x: point[0],
        y: point[1],
      }

      gsap.to(pointObj, {
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        x: `+=${Math.random() < 0.5 ? -this.width : this.width / 2}`,
        y: `+=${Math.random() < 0.5 ? -this.height / 2 : this.height / 2}`,
        onUpdate: () => {
          // Update the original data point with the new position
          this.data[index] = [pointObj.x, pointObj.y]

          // Now update the Voronoi diagram with the new data
          this.updateVoronoi()
        },
      })
    })
  }

  private generateDataPoints() {
    return [
      [50, 50],
      [150, 150],
      [150, 100],
      [250, 250],
      [450, 250],
    ]
  }
}

export default new Experience()

// const paths = [
//   // "M406.187 737.596L382.871 450.2L215.673 280.835L-4.95272e-05 737.596L406.187 737.596Z",
//   "M955.294 512.197L543.092 316.22L387.521 450.16L410.84 737.596L955.294 737.596L955.294 512.197Z",
//   // "M575.66 0.00063267L545.19 312.081L955.294 507.06L955.294 0.000665859L575.66 0.00063267Z",
//   // "M61.7999 -4.2474e-05L216.858 275.435L385.239 446L540.502 312.325L570.997 2.04139e-06L61.7999 -4.2474e-05Z",
// ]

// const [path1, path2, path3, path4, path5] = paths.map((path) =>
//   smoothPath(path, {
//     radius: 20,
//     numberAccuracy: 30,
//     // allowEllipse: false,
//     // preventOverflow: true,
//     // reduceCommands: true,
//   })
// )

// console.log(`
// <svg width="912" height="472" viewBox="0 0 912 472" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="${path1}" fill="#221155" fill-opacity="0.2"/>
//   <path d="${path2}" fill="#221155" fill-opacity="0.2"/>
//   <path d="${path3}" fill="#221155" fill-opacity="0.2"/>
//   <path d="${path4}" fill="#221155" fill-opacity="0.2"/>
// </svg>
// `)

// console.log({ path1, path2, path3, path4, path5 })
