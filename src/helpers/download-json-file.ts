export const downloadJSONFile = (
  data: object | string,
  filename: string = "jsonfile.json"
) => {
  if (!data) {
    console.error("No data");
    return;
  }

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }

  let blob: Blob = new Blob([data], { type: "text/json" }),
    a: HTMLAnchorElement = document.createElement("a");

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

  let event: MouseEvent = new MouseEvent("click");

  a.dispatchEvent(event);
};
