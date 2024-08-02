import ShortUniqueId from 'short-unique-id';

export const generateShortUniqId = (length: number) => {
    const uid = new ShortUniqueId({ length });
    uid.setDictionary('alpha_upper');
    return uid.rnd();
}
