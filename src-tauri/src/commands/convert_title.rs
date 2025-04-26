use regex::Regex;
use sluggify::sluggify::sluggify;

pub fn convert_title_to_file_name_base(input: &str) -> String {
    // Convert to lowercase
    let mut new_str = input.to_lowercase();

    // Replace accented characters with their non-accented equivalents
    new_str = new_str.replace('á', "a");
    new_str = new_str.replace('é', "e");
    new_str = new_str.replace('í', "i");
    new_str = new_str.replace('ó', "o");
    new_str = new_str.replace('ú', "u");
    new_str = new_str.replace('ü', "u");

    // Replace "ñ" with "n"
    new_str = new_str.replace('ñ', "n");

    new_str = sluggify(&new_str, None);

    // Replace spaces with dashes
    new_str = new_str.replace(' ', "-");

    // Replace special characters with dashes
    let re_special = Regex::new(r"[^a-z0-9-]").unwrap();
    new_str = re_special.replace_all(&new_str, "-").into_owned();

    // Remove consecutive dashes
    let re_consecutive = Regex::new(r"-+").unwrap();
    new_str = re_consecutive.replace_all(&new_str, "-").into_owned();

    new_str
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_conversion() {
        let input = "Mi Título de Película";
        let expected = "mi-titulo-de-pelicula";
        assert_eq!(convert_title_to_file_name_base(input), expected);
    }

    #[test]
    fn test_accents_and_special_chars() {
        let input = "Película épica: ¡acción y emoción!";
        let expected = "pelicula-epica-accion-y-emocion";
        assert_eq!(convert_title_to_file_name_base(input), expected);
    }

    #[test]
    fn test_consecutive_special_chars() {
        let input = "Hello!! World??";
        let expected = "hello-world";
        assert_eq!(convert_title_to_file_name_base(input), expected);
    }

    #[test]
    fn test_ñ_character() {
        let input = "Año de la Ñandú";
        let expected = "ano-de-la-nandu";
        assert_eq!(convert_title_to_file_name_base(input), expected);
    }

    #[test]
    fn test_multiple_spaces() {
        let input = "Movie    Title    Here";
        let expected = "movie-title-here";
        assert_eq!(convert_title_to_file_name_base(input), expected);
    }
}
