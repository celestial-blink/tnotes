import Note, { INote } from "../model/note";

export const create = async (payload: INote) => {
    const note = new Note(payload);
    const { _id } = await note.save();
    return _id;
}

interface IUpdate {
    _id: string,
    data: object
}

export const update = async (payload: IUpdate) => {
    const result = Note.findByIdAndUpdate(payload._id, payload.data, { projection: { _id: 1 } });
    return result;
}

interface IDelete {
    _id: string
}

export const remove = async (payload: IDelete) => {
    const result = Note.findOneAndDelete({ _id: payload._id });
    return result;
}

interface IFilter {
    match?: object,
    project?: object,
    sort?: any,
    skip?: number,
    limit?: number
}

export const filter = (payload: IFilter) => {
    const result = Note.aggregate([
        { $match: payload?.match ?? {} },
        { $project: payload?.project ?? {} },
        { $sort: payload?.sort ?? {} },
        { $skip: payload?.skip ?? 0 },
        { $limit: payload?.limit ?? 10 },
        { $count: "total" },
        {
            $addFields: {
                perPage: { $ceil: { $divide: ["$total", payload?.limit ?? 10] } },
                currentPage: (payload?.skip ?? 0) + 1
            }
        }
    ]);
    return result;
}
