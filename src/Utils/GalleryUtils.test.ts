import * as GalleryUtils from "./GalleryUtils";
import { JunoClient, IGalleryItem } from "../Juno/JunoClient";
import { ExplorerStub } from "../Explorer/OpenActionsStubs";
import { HttpStatusCodes } from "../Common/Constants";
import { GalleryTab, SortBy } from "../Explorer/Controls/NotebookGallery/GalleryViewerComponent";

const galleryItem: IGalleryItem = {
  id: "id",
  name: "name",
  description: "description",
  gitSha: "gitSha",
  tags: ["tag1"],
  author: "author",
  thumbnailUrl: "thumbnailUrl",
  created: "created",
  isSample: false,
  downloads: 0,
  favorites: 0,
  views: 0
};

describe("GalleryUtils", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("downloadItem shows dialog in data explorer", () => {
    const container = new ExplorerStub();
    container.showOkCancelModalDialog = jest.fn().mockImplementation();

    GalleryUtils.downloadItem(container, undefined, galleryItem, undefined);

    expect(container.showOkCancelModalDialog).toBeCalled();
  });

  it("favoriteItem favorites item", async () => {
    const container = new ExplorerStub();
    const junoClient = new JunoClient();
    junoClient.favoriteNotebook = jest
      .fn()
      .mockReturnValue(Promise.resolve({ status: HttpStatusCodes.OK, data: galleryItem }));
    const onComplete = jest.fn().mockImplementation();

    await GalleryUtils.favoriteItem(container, junoClient, galleryItem, onComplete);

    expect(junoClient.favoriteNotebook).toBeCalledWith(galleryItem.id);
    expect(onComplete).toBeCalledWith(galleryItem);
  });

  it("unfavoriteItem unfavorites item", async () => {
    const container = new ExplorerStub();
    const junoClient = new JunoClient();
    junoClient.unfavoriteNotebook = jest
      .fn()
      .mockReturnValue(Promise.resolve({ status: HttpStatusCodes.OK, data: galleryItem }));
    const onComplete = jest.fn().mockImplementation();

    await GalleryUtils.unfavoriteItem(container, junoClient, galleryItem, onComplete);

    expect(junoClient.unfavoriteNotebook).toBeCalledWith(galleryItem.id);
    expect(onComplete).toBeCalledWith(galleryItem);
  });

  it("deleteItem shows dialog in data explorer", () => {
    const container = new ExplorerStub();
    container.showOkCancelModalDialog = jest.fn().mockImplementation();

    GalleryUtils.deleteItem(container, undefined, galleryItem, undefined);

    expect(container.showOkCancelModalDialog).toBeCalled();
  });

  it("getGalleryViewerProps gets gallery viewer props correctly", () => {
    const selectedTab: GalleryTab = GalleryTab.OfficialSamples;
    const sortBy: SortBy = SortBy.MostDownloaded;
    const searchText = "my-complicated%20search%20query!!!";

    const response = GalleryUtils.getGalleryViewerProps(
      `?${GalleryUtils.GalleryViewerParams.SelectedTab}=${GalleryTab[selectedTab]}&${GalleryUtils.GalleryViewerParams.SortBy}=${SortBy[sortBy]}&${GalleryUtils.GalleryViewerParams.SearchText}=${searchText}`
    );

    expect(response).toEqual({
      selectedTab,
      sortBy,
      searchText: decodeURIComponent(searchText)
    } as GalleryUtils.GalleryViewerProps);
  });

  it("getNotebookViewerProps gets notebook viewer props correctly", () => {
    const notebookUrl = "https%3A%2F%2Fnotebook.url";
    const galleryItemId = "1234-abcd-efgh";
    const hideInputs = "true";

    const response = GalleryUtils.getNotebookViewerProps(
      `?${GalleryUtils.NotebookViewerParams.NotebookUrl}=${notebookUrl}&${GalleryUtils.NotebookViewerParams.GalleryItemId}=${galleryItemId}&${GalleryUtils.NotebookViewerParams.HideInputs}=${hideInputs}`
    );

    expect(response).toEqual({
      notebookUrl: decodeURIComponent(notebookUrl),
      galleryItemId,
      hideInputs: true
    } as GalleryUtils.NotebookViewerProps);
  });

  it("getTabTitle returns correct title for official samples", () => {
    expect(GalleryUtils.getTabTitle(GalleryTab.OfficialSamples)).toBe("Official samples");
  });
});
