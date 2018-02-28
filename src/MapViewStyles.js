const mapViewStyles = {
  mapTable: {
    borderWidth: 4,
    borderStyle: "solid",
    display: "table",
    position: "absolute",
    width: 420,
    height: 420,
    top: 5,
    left: 5,
    backgroundColor: "#ffffff",
    borderColor: "#795548",
  },
  row: {
    display: "table-row",
  },
  cell: {
    width: 35,
    height: 35,
    display: "table-cell",
    verticalAlign: "middle",
    textAlign: "center",
    position: "relative", // Tooltipin ja pelaajan kuvan asettelua varten.
  },
  areaImage: {
    width: "80%",
    height: "80%",
  },
  playerImage: {
    zIndex: 1,
    position: "relative",
    top: 0,
    left: 0,
    transitionProperty: "top, left",
  },
  unrevealedArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 35,
    height: 35,
    opacity: 1,
    transitionProperty: "opacity",
    backgroundColor: "#000000",
  },
  highlightedUnrevealedArea: {
    width: 32,
    height: 32,
  },
  revealingArea: {
    opacity: 0,
  },
  highlightedArea: {
    borderWidth: 2,
    width: 31, // Pienennetään solun pituutta ja leveyttä, jotta muodostettu
    height: 31, // reuna ei kasvattaisi solun kokoa muita suuremmaksi.
  },
  hoverArea: {
    borderStyle: "solid",
  },
  targetableArea: {
    borderStyle: "dashed",
  },
  targetedArea: {
    borderStyle: "solid",
  },
  targetedAreaAction: {
    position: "absolute",
    top: -4,
    left: -1,
    fontWeight: "bold",
  },
  areaTooltip: {
    position: "absolute",
    zIndex: 2,
    bottom: 33,
    right: 33,
    width: 130,
    textAlign: "center",
    padding: "5px 1px",
    borderRadius: "7px 7px 0px 7px",
    opacity: "0.8",
    backgroundColor: "#555",
    color: "#fff",
  },
  actionSlot: {
    borderWidth: 3,
    borderStyle: "solid",
    position: "absolute",
    width: 320,
    height: 110,
    right: 5,
    backgroundColor: "#ffffff",
    borderColor: "#000000",
  },
  firstActionSlot: {
    top: 5,
  },
  secondActionSlot: {
    top: 125,
  },
  thirdActionSlot: {
    top: 245,
  },
  selectedActionSlot: {
    borderColor: "#ffffff",
  },
  draggableAction: {
    width: 320,
    height: 100,
  },
  actionImage: {
    borderWidth: 2,
    borderStyle: "solid",
    float: "left",
    width: 50,
    height: 50,
    margin: "3px 3px 0px",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
  },
  actionInfo: {
    width: 315,
    margin: "auto",
    fontSize: "90%",
  },
  turnsDisplay: {
    fontSize: "115%",
    position: "absolute",
    textAlign: "center",
    top: 370,
    right: 5,
    width: 325,
  },
  turnBtn: {
    position: "absolute",
    top: 395,
    right: 5,
    width: 325,
  }
};

export default mapViewStyles;
