import { ObjectCache } from "../../../Common/ObjectCache";
import { GremlinVertex, GraphData } from "./GraphData";

/**
 * Remember vertex edge information
 */
export class EdgeInfoCache extends ObjectCache<GremlinVertex> {
  /**
   * Add vertex to the cache. If already exists, merge all the edge information with the existing element
   * @param vertex
   */
  public addVertex(vertex: GremlinVertex): void {
    let v: GremlinVertex;
    if (super.has(vertex.id)) {
      v = super.get(vertex.id);
      GraphData.addEdgeInfoToVertex(v, vertex);
      v._outEdgeIds = vertex._outEdgeIds;
      v._inEdgeIds = vertex._inEdgeIds;
      v._outEAllLoaded = vertex._outEAllLoaded;
      v._inEAllLoaded = vertex._inEAllLoaded;
    } else {
      v = vertex;
    }
    super.set(v.id, v);
  }

  /**
   * If the target is in the cache, retrieve edge information from cache and merge to this target
   * @param id
   */
  public mergeEdgeInfo(target: GremlinVertex): void {
    if (super.has(target.id)) {
      const cachedVertex = super.get(target.id);
      GraphData.addEdgeInfoToVertex(target, cachedVertex);
      target._outEdgeIds = cachedVertex._outEdgeIds;
      target._inEdgeIds = cachedVertex._inEdgeIds;
      target._outEAllLoaded = cachedVertex._outEAllLoaded;
      target._inEAllLoaded = cachedVertex._inEAllLoaded;
    }
  }
}
