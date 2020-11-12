import PropTypes from 'prop-types';
import * as Styles from './styles';

const GalleryCard = (props) => {
  return (
    <Styles.GalleryCard>
      <Styles.Image src={props.image} alt={props.name} />
      <Styles.Content>
        <Styles.Title>{props.name}</Styles.Title>
        <Styles.Icons>
          <Styles.Icon className="material-icons">edit</Styles.Icon>
          <Styles.Icon className="material-icons">delete</Styles.Icon>
        </Styles.Icons>
      </Styles.Content>
    </Styles.GalleryCard>
  );
};

GalleryCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
};

export default GalleryCard;