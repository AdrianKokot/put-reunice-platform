package com.example.cms.file;

import com.example.cms.page.Page;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
public class FileResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ERRORS.FILE.400.FILENAME_EMPTY")
    private String filename;

    @NotBlank(message = "ERRORS.FILE.400.FILETYPE_EMPTY")
    private String fileType;

    @NotNull(message = "ERRORS.FILE.400.FILESIZE_EMPTY")
    private Long fileSize;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] data;

    private Timestamp uploadDate;

    private Long uploadedById;
    private String uploadedBy;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @NotNull(message = "ERRORS.FILE.400.PAGE_EMPTY")
    private Page page;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FileResource)) return false;
        FileResource that = (FileResource) o;
        return id.equals(that.id)
                && Objects.equals(filename, that.filename)
                && Objects.equals(fileType, that.fileType)
                && Objects.equals(fileSize, that.fileSize)
                && Arrays.equals(data, that.data)
                && Objects.equals(uploadDate, that.uploadDate)
                && Objects.equals(uploadedBy, that.uploadedBy)
                && page.equals(that.page);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, filename, fileType, fileSize, uploadDate, uploadedBy, page);
        result = 31 * result + Arrays.hashCode(data);
        return result;
    }
}
