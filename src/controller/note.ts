import Note, { INote } from "../model/note";

export const create = async (payload: INote) => {
    const note = new Note(payload);
    const { _id } = await note.save();
    return _id;
}

interface IPayloadNotes {
    _id: string;
    idUser: string;
}

interface IUpdate extends IPayloadNotes {
    data: object
}

export const update = async (payload: IUpdate) => {
    const result = Note.findOneAndUpdate({ _id: payload._id, idUser: payload.idUser }, payload.data, { projection: { _id: 1 } })
    return result;
}

interface IDelete extends IPayloadNotes { }

export const remove = async (payload: IDelete) => {
    const result = Note.findOneAndDelete({ _id: payload._id, idUser: payload.idUser }, { projection: { _id: 1 } });
    return result;
}

interface IFilter {
    match: object,
    project: object,
    sort: any,
    skip: number,
    limit: number,
}

export const filter = async (payload: IFilter) => {
    const result = await Note.aggregate([
        { $match: payload.match || {} },
        { $project: payload.project },
        { $sort: payload.sort || {} },
        { $skip: payload.skip || 0 },
        { $limit: payload.limit || 10 }
    ]);

    return result;
}

export const totalFilter = async (payload: IFilter) => {
    const total = await Note.aggregate<{ total: number, totalPages: number }>([
        { $match: payload?.match ?? {} },
        { $project: { _id: 1 } },
        { $count: "total" },
        {
            $addFields: {
                totalPages: { $ceil: { $divide: ["$total", payload.limit] } },
            }
        }
    ]);

    return total;
}
